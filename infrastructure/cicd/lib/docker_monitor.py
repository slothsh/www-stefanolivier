from lib.log import Log
import subprocess
import requests
from typing import Self, Tuple
from dataclasses import dataclass
from enum import IntEnum

type UserAuthentication = Tuple[str, str]

class ContainerStatus(IntEnum):
    FRESH = 0
    STALE = 1
    NO_LIVE_IMAGE = 2
    NO_REGISTRY_IMAGE = 3

@dataclass
class DockerMonitor:
    container_name: str
    registry_name: str
    repository: str
    authentication: UserAuthentication
    verify_tls: bool = True;

    live_image_digest: str = ''
    latest_image_digest: str = ''
    directory: str = ''

    def __post_init__(self: Self):
        self.registry_url = f'https://{self.registry_name}'

    def _get_latest_image_digest(self: Self) -> str:
        try:
            headers = { 'Accept': 'application/vnd.docker.distribution.manifest.v1+json' }
            manifest_response = requests.get(f'{self.registry_url}/v2/{self.repository}/manifests/latest', auth=self.authentication, headers=headers, verify=self.verify_tls)

            if manifest_response.status_code != 200:
                Log.error(f'bad response for manifest from registry: {manifest_response.status_code} - {manifest_response.text}')
                return ''

            image_digest = manifest_response.json()['manifests'][0]['digest'].strip()
            blob_response = requests.get(f'{self.registry_url}/v2/{self.repository}/blobs/{image_digest}', auth=self.authentication, headers=headers, verify=self.verify_tls)

            if blob_response.status_code != 200:
                Log.error(f'bad response for blob from registry: {blob_response.status_code} - {blob_response.text}')
                return ''

            return blob_response.json()['config']['digest'].strip()

        except Exception as e:
            Log.error('failed GET request to registry with error:', str(e))
            return ''


    def _get_live_container_image_digest(self: Self) -> str:
        try:
            live_image_id = subprocess.run(['docker', 'inspect', self.container_name, '--format="{{.Image}}"'], stdout=subprocess.PIPE)
            return live_image_id.stdout.decode('utf-8').strip()[1:-1]
        except Exception as e:
            Log.warn('querying live container returned an error:', str(e))
            return ''


    def refresh_live_image(self: Self) -> None:
        try:
            Log.info(f'pulling latest image: {self.registry_name}/{self.repository}:latest')
            subprocess.run(['docker', 'pull', f'{self.registry_name}/{self.repository}:latest'])
            Log.info(f'killing & removing docker container: {self.container_name}')
            subprocess.run(['docker', 'compose', f'--project-directory={self.directory}', 'down'])
            Log.info(f'starting image: {self.registry_name}/{self.repository}:latest with name {self.container_name}')
            subprocess.run(['docker', 'compose', f'--project-directory={self.directory}', 'up', '-d'])
        except Exception as e:
            Log.error(f'failed to reload docker container with image: {str(e)}')


    def status(self: Self) -> ContainerStatus:
        self.live_image_digest = self._get_live_container_image_digest()
        self.latest_image_digest = self._get_latest_image_digest()

        if self.live_image_digest == '' or self.live_image_digest is None:
            return ContainerStatus.NO_LIVE_IMAGE

        if self.latest_image_digest == '' or self.latest_image_digest is None:
            return ContainerStatus.NO_REGISTRY_IMAGE

        if self.live_image_digest != self.latest_image_digest:
            return ContainerStatus.STALE

        return ContainerStatus.FRESH

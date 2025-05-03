#!/usr/bin/env python3

from lib.docker_monitor import DockerMonitor, ContainerStatus
from lib.env import Env
from lib.log import Log
import time

POLL_INTERVAL = 10

def main():
    env = Env('.env')

    docker_monitor = DockerMonitor(
        registry_name='registry.stefanolivier.com',
        repository='www-stefanolivier',
        container_name='website',
        authentication=(env['REGISTRY_USER'], env['REGISTRY_PASSWORD']),
    )

    Log.info(f'polling {docker_monitor.registry_url}/{docker_monitor.repository} every {POLL_INTERVAL} seconds...')

    while True:
        time.sleep(POLL_INTERVAL)

        match docker_monitor.status():
            case ContainerStatus.STALE:
                Log.info(f'unmatched image digests: live: [{docker_monitor.live_image_digest}] latest: [{docker_monitor.latest_image_digest}]')
                docker_monitor.refresh_live_image()
            case ContainerStatus.NO_LIVE_IMAGE:
                Log.warn('no live image available:', f'live({docker_monitor.live_image_digest})', f'latest({docker_monitor.latest_image_digest})')
                Log.info('restaring...')
                docker_monitor.refresh_live_image()
            case ContainerStatus.NO_REGISTRY_IMAGE:
                Log.error('no registry image available:', f'live({docker_monitor.live_image_digest})', f'latest({docker_monitor.latest_image_digest})')
            case ContainerStatus.FRESH:
                Log.info(f'live container is fresh({docker_monitor.live_image_digest}) latest({docker_monitor.latest_image_digest})')
            case status:
                Log.warn('unknown docker status:', status)

if __name__ == '__main__':
    main()

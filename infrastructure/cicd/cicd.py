#!/usr/bin/env python3

import time
import subprocess
import requests

CONTAINER_NAME = 'website'
REGISTRY_URL = "https://registry.stefanolivier.com"
REGISTRY_NAME = "registry.stefanolivier.com"
REPOSITORY = "www-stefanolivier"
POLL_INTERVAL = 60

def get_auth():
    env = [s.strip() for s in open('.env', 'r').readlines()]
    user = env[0]
    password = env[1]
    return (user, password)

def get_latest_image_digest(auth):
    try:
        headers = { 'Accept': 'application/vnd.docker.distribution.manifest.v1+json' }
        manifest_response = requests.get(f'{REGISTRY_URL}/v2/{REPOSITORY}/manifests/latest', auth=auth, headers=headers)

        if manifest_response.status_code != 200:
            print(f'Bad response for manifest from registry: {manifest_response.status_code} - {manifest_response.text}')
            return ''

        image_digest = manifest_response.json()['manifests'][0]['digest'].strip()
        blob_response = requests.get(f'{REGISTRY_URL}/v2/{REPOSITORY}/blobs/{image_digest}', auth=auth, headers=headers)

        if blob_response.status_code != 200:
            print(f'Bad response for blob from registry: {blob_response.status_code} - {blob_response.text}')
            return ''

        return blob_response.json()['config']['digest'].strip()

    except Exception as e:
        print(f'Failed GET to registry with error: {str(e)}')
        return ''

def get_live_container_image_digest():
    try:
        live_image_id = subprocess.run(['docker', 'inspect', CONTAINER_NAME, '--format="{{.Image}}"'], stdout=subprocess.PIPE)
        return live_image_id.stdout.decode('utf-8').strip()[1:-1]
    except Exception as e:
        return ''

def reload_website():
    try:
        print(f'Pulling latest image: {REGISTRY_NAME}/{REPOSITORY}:latest')
        subprocess.run(['docker', 'pull', f'{REGISTRY_NAME}/{REPOSITORY}:latest'])
        print(f'Killing docker container: {CONTAINER_NAME}')
        subprocess.run(['docker', 'kill', CONTAINER_NAME])
        print(f'Removing docker container: {CONTAINER_NAME}')
        subprocess.run(['docker', 'rm', CONTAINER_NAME])
        print(f'Starting image: {REGISTRY_NAME}/{REPOSITORY}:latest with name {CONTAINER_NAME}')
        subprocess.run(['docker', 'run', '--name', CONTAINER_NAME, '-d', '-p', '8000:80', '-p', '13714:13714', f'{REGISTRY_NAME}/{REPOSITORY}:latest'])
    except Exception as e:
        pass

def main():
    print(f"Polling {REGISTRY_URL}/{REPOSITORY} every {POLL_INTERVAL} seconds...")
    auth = get_auth()

    while True:
        time.sleep(POLL_INTERVAL)

        live_image_digest = get_live_container_image_digest()
        latest_image_digest = get_latest_image_digest(auth)

        if live_image_digest == '' or live_image_digest is None or latest_image_digest == '' or latest_image_digest is None:
            print(f'Empty image digests: live: [{live_image_digest}] latest: [{latest_image_digest}]')
            continue

        if live_image_digest != latest_image_digest:
            print(f'Unmatched image digests: live: [{live_image_digest}] latest: [{latest_image_digest}]')
            reload_website()

        print(f'Latest image is live')

if __name__ == "__main__":
    main()

#!/usr/bin/env python3

import time
import subprocess

CONTAINER_NAME = 'website'
REGISTRY_URL = "https://registry.stefanolivier.com"
REGISTRY_NAME = "registry.stefanolivier.com"
REPOSITORY = "www-stefanolivier"
POLL_INTERVAL = 60

def get_latest_image_digest():
    try:
        current_hash = subprocess.run(['docker', 'image', 'inspect', f'{REGISTRY_NAME}/{REPOSITORY}', '--format="{{.Id}}"'], stdout=subprocess.PIPE)
        return current_hash.stdout.decode('utf-8').strip()
    except Exception as e:
        return ''

def get_live_container_image_digest():
    try:
        current_hash = subprocess.run(['docker', 'inspect', CONTAINER_NAME, '--format="{{.Image}}"'], stdout=subprocess.PIPE)
        return current_hash.stdout.decode('utf-8').strip()
    except Exception as e:
        return ''

def reload_website():
    try:
        print(f'Killing docker container: {CONTAINER_NAME}')
        subprocess.run(['docker', 'kill', CONTAINER_NAME])
        print(f'Removing docker container: {CONTAINER_NAME}')
        subprocess.run(['docker', 'rm', CONTAINER_NAME])
        print(f'Pulling latest image: {REGISTRY_NAME}/{REPOSITORY}:latest')
        subprocess.run(['docker', 'pull', f'{REGISTRY_NAME}/{REPOSITORY}:latest'])
        print(f'Starting image: {REGISTRY_NAME}/{REPOSITORY}:latest with name {CONTAINER_NAME}')
        subprocess.run(['docker', 'run', '--name', CONTAINER_NAME, '-d', '-p', '8000:80', '-p', '13714:13714', f'{REGISTRY_NAME}/{REPOSITORY}:latest'])
    except Exception as e:
        pass

def main():
    print(f"Polling {REGISTRY_URL}/{REPOSITORY} every {POLL_INTERVAL} seconds...")

    while True:
        time.sleep(POLL_INTERVAL)

        live_image_digest = get_live_container_image_digest()
        latest_image_digest = get_latest_image_digest()

        if live_image_digest == '' or live_image_digest is None or latest_image_digest == '' or latest_image_digest is None:
            print(f'Empty image digests: live: [{live_image_digest}] latest: [{latest_image_digest}]')
            continue

        if live_image_digest != latest_image_digest:
            print(f'Unmatched image digests: live: [{live_image_digest}] latest: [{latest_image_digest}]')
            reload_website()

        print(f'Latest image is live')

if __name__ == "__main__":
    main()

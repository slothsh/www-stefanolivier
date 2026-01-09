#!/usr/bin/env python3

from lib.docker_monitor import DockerMonitor, ContainerStatus
from lib.env import Env
from lib.log import Log
import time

POLL_INTERVAL = 10

def main():
    env = Env('.env')

    docker_monitors = [
        DockerMonitor(
            registry_name='registry.stefanolivier.com',
            repository='www-stefanolivier',
            container_name='website-stefanolivier',
            directory='/var/website-stefanolivier',
            authentication=(env['REGISTRY_USER'], env['REGISTRY_PASSWORD']),
        ),
        DockerMonitor(
            registry_name='registry.stefanolivier.com',
            repository='www-ourshare',
            container_name='website-ourshare',
            directory='/var/website-ourshare',
            authentication=(env['REGISTRY_USER'], env['REGISTRY_PASSWORD']),
        ),
        DockerMonitor(
            registry_name='registry.stefanolivier.com',
            repository='www-ourshare-staging',
            container_name='website-ourshare-staging',
            directory='/var/website-ourshare-staging',
            authentication=(env['REGISTRY_USER'], env['REGISTRY_PASSWORD']),
        ),
    ]

    for monitor in docker_monitors:
        Log.info(f'polling {monitor.registry_url}/{monitor.repository} every {POLL_INTERVAL} seconds...')

    while True:
        time.sleep(POLL_INTERVAL)

        for monitor in docker_monitors:
            match monitor.status():
                case ContainerStatus.STALE:
                    Log.info(f'unmatched image digests: live: [{monitor.live_image_digest}] latest: [{monitor.latest_image_digest}]')
                    monitor.refresh_live_image()
                case ContainerStatus.NO_LIVE_IMAGE:
                    Log.warn('no live image available:', f'live({monitor.live_image_digest})', f'latest({monitor.latest_image_digest})')
                    Log.info('restaring...')
                    monitor.refresh_live_image()
                case ContainerStatus.NO_REGISTRY_IMAGE:
                    Log.error('no registry image available:', f'live({monitor.live_image_digest})', f'latest({monitor.latest_image_digest})')
                case ContainerStatus.FRESH:
                    Log.info(f'live container is fresh({monitor.live_image_digest}) latest({monitor.latest_image_digest})')
                case status:
                    Log.warn('unknown docker status:', status)

if __name__ == '__main__':
    main()

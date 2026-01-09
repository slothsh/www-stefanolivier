#!/usr/bin/env python3

from lib.log import Log
from lib.database_monitor import DatabaseMonitor, DatabaseStatus
import time

POLL_INTERVAL = 10

def main():
    database_monitors = [
        DatabaseMonitor(
            live_database='/var/website-stefanolivier/data/database.sqlite',
            backup_directory='/var/website-stefanolivier/backup',
            directory='/var/website-stefanolivier',
        ),
        DatabaseMonitor(
            live_database='/var/website-ourshare/data/database.sqlite',
            backup_directory='/var/website-ourshare/backup',
            directory='/var/website-ourshare',
        ),
        DatabaseMonitor(
            live_database='/var/website-ourshare-staging/data/database.sqlite',
            backup_directory='/var/website-ourshare-staging/backup',
            directory='/var/website-ourshare-staging',
        ),
    ]

    while True:
        time.sleep(POLL_INTERVAL)

        for monitor in database_monitors:
            match monitor.status():
                case DatabaseStatus.FRESH:
                    Log.info('live database is fresh: /var/website/data/database.sqlite')
                case DatabaseStatus.STALE:
                    Log.info('live database is stale: /var/website/data/database.sqlite')
                    Log.info('backing up to /var/website/backup')
                    monitor.backup()
                case status:
                    Log.warn('unknown database status:', status)

if __name__ == '__main__':
    main()

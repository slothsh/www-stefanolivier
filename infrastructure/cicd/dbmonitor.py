#!/usr/bin/env python3

from lib.log import Log
from lib.database_monitor import DatabaseMonitor, DatabaseStatus
import time

POLL_INTERVAL = 10

def main():
    database_monitor = DatabaseMonitor(
        live_database='/var/website/data/database.sqlite',
        backup_directory='/var/website/backup',
    )

    while True:
        time.sleep(POLL_INTERVAL)

        match database_monitor.status():
            case DatabaseStatus.FRESH:
                Log.info('live database is fresh: /var/website/data/database.sqlite')
            case DatabaseStatus.STALE:
                Log.info('live database is stale: /var/website/data/database.sqlite')
                Log.info('backing up to /var/website/backup')
                database_monitor.backup()
            case status:
                Log.warn('unknown database status:', status)

if __name__ == '__main__':
    main()

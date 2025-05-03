from lib.log import Log
from dataclasses import dataclass
from typing import Self
from enum import IntEnum
from pathlib import Path
import os
import subprocess
import time

class DatabaseStatus(IntEnum):
    FRESH = 0
    STALE = 1

@dataclass
class DatabaseMonitor:
    live_database: str
    backup_directory: str
    stale_period: int = 600

    def _get_live_db_time(self: Self) -> float:
        return os.path.getmtime(self.live_database)


    def _get_backup_db_time(self: Self) -> float:
        backup_database = Path(self.backup_directory) / Path('database-latest.sqlite')
        if backup_database.exists():
            return backup_database.stat().st_mtime
        return time.time()


    def backup(self: Self) -> None:
        temp_backup_database = None

        try:
            live_database = Path(self.live_database)
            backup_database = Path(self.backup_directory) / Path('database-latest.sqlite')

            if backup_database.exists():
                temp_backup_database = backup_database.rename('/var/website/backup/database-latest.tmp.sqlite')

            if live_database.exists():
                subprocess.run(["sqlite3", str(live_database.absolute()), f"VACUUM INTO '{str(backup_database.absolute())}';"])
                live_database.touch()

            if temp_backup_database is not None:
                temp_backup_database.unlink()

        except Exception as e:
            Log.error(f'failed to backup live database: {self.live_database}:', str(e))
            if temp_backup_database is not None:
                temp_backup_database.rename('/var/website/backup/database-latest.sqlite')


    def status(self: Self) -> DatabaseStatus:
        self.live_db_time = self._get_live_db_time()

        if time.time() - self.live_db_time >= self.stale_period:
            return DatabaseStatus.STALE

        return DatabaseStatus.FRESH

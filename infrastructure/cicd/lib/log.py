from enum import StrEnum
from datetime import datetime
    
class LogLevel(StrEnum):
    INFO = 'INFO'
    WARN = 'WARN'
    ERROR = 'ERROR'

class Log:
    @classmethod
    def info(cls, *args: str) -> None:
        message = ' '.join(args)
        Log._print(LogLevel.INFO, message)

    @classmethod
    def warn(cls, *args: str) -> None:
        message = ' '.join(args)
        Log._print(LogLevel.WARN, message)

    @classmethod
    def error(cls, *args: str) -> None:
        message = ' '.join(args)
        Log._print(LogLevel.ERROR, message)

    @classmethod
    def _print(cls, level: LogLevel, message: str) -> None:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f'[{level}] {now} {message}')

from lib.log import Log
from dataclasses import dataclass
from typing import Self, Dict

@dataclass
class Env:
    environment_file: str

    def __post_init__(self: Self):
        self._env = Env.load_environment(self.environment_file)
        Log.info(str(self._env))

    def __getitem__(self: Self, key: str) -> str:
        if key in self._env:
            return self._env[key]
        return ''

    @classmethod
    def load_environment(cls, path: str) -> Dict[str, str]:
        try:
            return {l.split('=')[0].strip(): l.split('=')[1].strip() for l in open(path, 'r').readlines()}
        except Exception as e:
            Log.error(f'could not load environment file {path}:', str(e))
            return {}

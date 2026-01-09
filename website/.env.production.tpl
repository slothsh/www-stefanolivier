APP_NAME=website-stefanolivier
APP_ENV=production
{{ with secret "kv/data/default/website-stefanolivier/app" }}
APP_KEY={{ .Data.data.key }}
{{ end }}
APP_DEBUG=false
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_USERNAME=app
DB_DATABASE=stefanolivier
{{ with service "database" }}
DB_HOST={{ (index . 0).Address }}
DB_PORT={{ (index . 0).Port }}
{{ end }}

CACHE_STORE=database
DB_CACHE_CONNECTION=cache_sqlite
DB_CACHE_LOCK_CONNECTION=cache_sqlite
DB_CACHE_DATABASE=storage/framework/cache/cache.sqlite

QUEUE_CONNECTION=database
DB_QUEUE_CONNECTION=cache_sqlite
DB_QUEUE_TABLE=jobs

BROADCAST_DRIVER=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

INERTIA_SSR_URL="https://127.0.0.1:13814"

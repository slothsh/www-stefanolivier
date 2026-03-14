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

QUEUE_CONNECTION=database
DB_QUEUE_CONNECTION=cache_sqlite
DB_QUEUE_TABLE=jobs

BROADCAST_DRIVER=log
FILESYSTEM_DISK=local
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME="s.olivier1194+website@gmail.com"
{{ with secret "kv/data/default/website-stefanolivier/email" }}
MAIL_PASSWORD="{{ .Data.data.gmail_password }}"
{{ end }}
MAIL_ME_ADDRESS="s.olivier1194@gmail.com"
MAIL_ME_NAME="Stefan Olivier"
MAIL_FROM_ADDRESS="s.olivier1194+website@gmail.com"
MAIL_FROM_NAME="Website"

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

LARAVEL_PDF_DRIVER=gotenberg
{{ with service "gottenberg" }}
GOTENBERG_URL=http://{{ (index . 0).Address }}:{{ (index . 0).Port }}
{{ end }}
{{ with secret "kv/data/default/secrets/gottenberg" }}
GOTENBERG_USERNAME="{{ .Data.data.username }}"
GOTENBERG_PASSWORD="{{ .Data.data.password }}"
{{ end }}

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL="http://127.0.0.1:13714"

{{ with secret "kv/data/default/website-stefanolivier/discord" }}
LOG_DISCORD_WEBHOOK_URL="{{ .Data.data.log_webhook_url }}"
{{ end }}

API_TOKEN={{ secret "kv/data/default/website-stefanolivier/api-token" }}

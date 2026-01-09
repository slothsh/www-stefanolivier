FROM ubuntu:latest AS environment

ARG APP_NAME="website-stefanolivier"

# Install utilities
RUN apt-get update
RUN apt-get install -y curl jq

# Copy DB certificates to the build
RUN mkdir -p /secrets/certs/
RUN --mount=type=secret,id=VAULT_TOKEN,env=VAULT_TOKEN curl -X GET -H "X-Vault-Token: ${VAULT_TOKEN}" "https://vault.stefanolivier.com/v1/kv/data/default/${APP_NAME}/certs/postgres" | jq -r '.data.data.ca' > /secrets/certs/postgres-ca.crt
RUN --mount=type=secret,id=VAULT_TOKEN,env=VAULT_TOKEN curl -X GET -H "X-Vault-Token: ${VAULT_TOKEN}" "https://vault.stefanolivier.com/v1/kv/data/default/${APP_NAME}/certs/postgres" | jq -r '.data.data.cert' > /secrets/certs/postgres.crt
RUN --mount=type=secret,id=VAULT_TOKEN,env=VAULT_TOKEN curl -X GET -H "X-Vault-Token: ${VAULT_TOKEN}" "https://vault.stefanolivier.com/v1/kv/data/default/${APP_NAME}/certs/postgres" | jq -r '.data.data.key' > /secrets/certs/postgres.key

# Main build
FROM ubuntu:latest

# Add app User
RUN useradd -m app

# Fetch certs
RUN mkdir -p /secrets/certs
COPY --from=environment /secrets/certs/* /secrets/certs/
RUN chown app:app /secrets/certs/* && chmod 600 /secrets/certs/*

# Install dependencies
ENV BUN_INSTALL=/home/app/.bun
RUN mkdir /home/app/.composer
RUN apt-get update
RUN apt-get install -y curl unzip
RUN apt-get install -y supervisor sqlite3 nginx nginx-extras
RUN apt-get install -y php php-cli
RUN apt-get install -y php-mbstring php-xml php-bcmath php-curl php-zip php-sqlite3 php-pgsql php-tokenizer php-ctype php-json php-fpm
RUN curl -fsSL https://bun.sh/install | bash
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir /home/app/.composer --filename composer

# Build app
COPY ./website /app/build
WORKDIR /app/build
RUN /home/app/.composer/composer update
RUN /home/app/.composer/composer install
RUN touch ./storage/framework/cache/cache.sqlite
RUN php artisan migrate --path=database/migrations/cache --database=cache_sqlite --force
RUN php artisan config:clear
RUN php artisan optimize
RUN /home/app/.bun/bin/bun install
RUN /home/app/.bun/bin/bun run build

# Clean-up
RUN apt autoremove --purge

# Server Configuration
COPY ./infrastructure/website/nginx.conf /etc/nginx/nginx.conf
COPY ./infrastructure/website/php-fpm-www.conf /etc/php/8.3/fpm/pool.d/www.conf
COPY ./infrastructure/website/php-fpm.conf /etc/php/8.3/fpm/php-fpm.conf
COPY ./infrastructure/website/supervisord.conf /etc/supervisor/supervisord.conf

# Server logs
RUN mkdir -p /app/logs/nginx && mkdir -p /app/logs/php && mkdir /app/logs/supervisord

# Set app permissions
RUN chown -R app:app /app /home/app
RUN chmod -R 755 /app /home/app

# Clear build secrets
RUN rm -rf /secrets

# Set app environment
USER app
ENV PATH="/home/app/.local/bin:/home/app/.bun/bin:/home/app/.composer:${PATH}"
WORKDIR /app

# Run app
EXPOSE 80
EXPOSE 13714

CMD ["supervisord"]

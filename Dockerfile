FROM php:8.4-cli

RUN apt-get update -y && apt-get install -y unzip curl default-mysql-client libpq-dev nodejs npm

RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql calendar

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN npm install && npm run build 

RUN chmod -R 777 storage bootstrap/cache

RUN rm -f bootstrap/cache/*.php
CMD php artisan config:clear && (php artisan migrate --force || true) && php -S 0.0.0.0:$PORT -t public
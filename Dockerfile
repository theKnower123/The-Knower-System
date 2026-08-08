# استخدام نسخة PHP 8.4 
FROM php:8.4-cli

# تسطيب المكتبات الأساسية، وإضافة Node.js و npm للفرونت إند، ومكتبات قواعد البيانات
RUN apt-get update && apt-get install --no-install-recommends -y php8.3 php8.3-curl php8.3-mbstring php8.3-xml
# تسطيب إضافات الداتابيز (MySQL و PostgreSQL) وإضافة التقويم
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql calendar


# تحميل Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تحديد مسار العمل جوه السيرفر
WORKDIR /app

# نسخ كل ملفات المشروع
COPY . .
<<<<<<< HEAD
RUN rm -f bootstrap/cache/*.php
# تسطيب حزم لارافل للإنتاج
=======

# تسطيب حزم لارافل
>>>>>>> parent of ef5bf77 (phase 16 edit again  docker)
RUN composer install --no-dev --optimize-autoloader

# تسطيب حزم الفرونت إند وعمل Build بدل dev للإنتاج
RUN npm install && npm run build

# إعطاء صلاحيات للكتابة في مجلدات التخزين
RUN chmod -R 777 storage bootstrap/cache

# أمر التشغيل: عمل المايجريشن أوتوماتيك وبعدين تشغيل السيرفر

CMD npm run dev -- --host 0.0.0.0 & php artisan config:clear && php artisan migrate:fresh --force && php artisan migrate --force && php -S 0.0.0.0:$PORT -t public

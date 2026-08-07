# استخدام نسخة PHP 8.4 
FROM php:8.4-cli

# تسطيب المكتبات الأساسية للنظام، وإضافة Node.js و npm للفرونت إند
RUN apt-get update -y && apt-get install -y unzip curl default-mysql-client libpq-dev nodejs npm

# تسطيب إضافات الداتابيز المطلوبة للارافل والتقويم
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql calendar

# تحميل Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تحديد مسار العمل
WORKDIR /app

# نسخ كل ملفات المشروع
COPY . .

# تسطيب حزم لارافل للإنتاج
RUN composer install --no-dev --optimize-autoloader

# تسطيب حزم النود وعمل Build للفرونت إند
RUN npm install && npm run build

# إعطاء صلاحيات للكتابة في مجلدات التخزين
RUN chmod -R 777 storage bootstrap/cache


# أمر التشغيل: عمل المايجريشن أوتوماتيك وبعدين تشغيل السيرفر

CMD php artisan migrate --force && php -S 0.0.0.0:$PORT -t public 


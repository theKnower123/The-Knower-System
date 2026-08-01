# استخدام نسخة PHP 8.3
FROM php:8.3-cli

# تسطيب المكتبات الأساسية، وإضافة Node.js و npm عشان الفرونت إند
RUN apt-get update -y && apt-get install -y \
    unzip \
    curl \
    default-mysql-client \
    libpq-dev \
    nodejs \
    npm

# تسطيب إضافات الداتابيز (تدعم MySQL و PostgreSQL)
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql calendar

# تحميل Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تحديد مسار العمل جوه السيرفر
WORKDIR /app

# نسخ كل ملفات المشروع
COPY . .

# تسطيب حزم لارافل للباك إند
RUN composer install --no-dev --optimize-autoloader

# تسطيب حزم النود وعمل Build لملفات الفرونت إند (React)
# على السيرفر بنستخدم build بدل dev عشان يطلع الملفات النهائية الجاهزة
RUN npm install && npm run build

# إعطاء صلاحيات للكتابة في مجلدات التخزين (مهم جداً عشان رفع الملفات الجديدة)
RUN chmod -R 777 storage bootstrap/cache

# أمر التشغيل: تشغيل السيرفر فقط (بدون تعديل الداتابيز)
CMD php -S 0.0.0.0:$PORT -t public
FROM php:7.1.3-fpm

RUN apt-get update && apt-get install -y libmcrypt-dev mysql-client libmagickwand-dev wget curl build-essential zip unzip \
  vim nano dialog net-tools gnupg --no-install-recommends \
  && pecl install imagick \
  && pecl install zip \
  && docker-php-ext-enable imagick \
  && docker-php-ext-install mcrypt pdo_mysql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*
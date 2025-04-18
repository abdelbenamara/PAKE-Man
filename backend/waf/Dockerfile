FROM ubuntu:22.04

RUN apt update && apt install -y \
    apache2 \
    libapache2-mod-security2 \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod security2

#COPY /tools/modsecurity-rules.conf /etc/modsecurity/modsecurity.conf
#COPY /tools/modsecurity-rules.conf /etc/modsecurity/modsecurity.conf-recommended
#COPY /tools/modsecurity-rules.conf /etc/modsecurity/custom-rules.conf
#RUN echo "Include /etc/modsecurity/custom-rules.conf" >> /etc/modsecurity/modsecurity.conf

#COPY owasp-modsecurity-crs /etc/modsecurity/owasp-modsecurity-crs
#RUN ln -s /etc/modsecurity/owasp-modsecurity-crs/crs-setup.conf.example /etc/modsecurity/owasp-modsecurity-crs/crs-setup.conf
#COPY /tools/modsecurity-rules.conf /etc/apache2/modsecurity-rules.conf

#RUN echo "Include /etc/apache2/modsecurity-rules.conf" >> /etc/apache2/apache2.conf

#RUN mv /usr/share/modsecurity-crs /etc/modsecurity/

EXPOSE 80 443

#CMD ["apachectl", "-D", "FOREGROUND"]
FROM curlimages/curl:latest

COPY tools/ .
RUN chmod +x setup.sh

HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD curl -f http://elasticsearch:9200 || exit 1

ENTRYPOINT ["/setup.sh"]
#!/bin/sh

until curl -s -u "elastic:${ELASTIC_PASSWORD}" http://elasticsearch:9200 >/dev/null; do
  echo "Elasticsearch not reachable, retrying in 5 seconds..."
  sleep 5
done

curl -u "elastic:${ELASTIC_PASSWORD}" -X PUT "http://elasticsearch:9200/_ilm/policy/logs_policy" \
  -H 'Content-Type: application/json' -d @/init/ilm_policy.json

# Optionally create index template that uses it
curl -u "elastic:${ELASTIC_PASSWORD}" -X PUT "http://elasticsearch:9200/_index_template/logs_template" \
  -H 'Content-Type: application/json' -d '
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "logs_policy",
      "index.lifecycle.rollover_alias": "logs"
    }
  }
}'

# elastic_user:elastic_password
curl -u "elastic:$ELASTIC_PASSWORD" -X PUT "$ES_HOST/logs-000001" \
  -H 'Content-Type: application/json' -d '
{
  "aliases": {
    "logs": {
      "is_write_index": true
    }
  }
}'

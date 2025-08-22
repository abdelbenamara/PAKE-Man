#!/bin/bash

main() {
  touch package-lock.json \
  && docker run \
    -e "NODE_ENV=production" \
    -v "$(pwd)/package.json:/package.json:ro" \
    -v "$(pwd)/package-lock.json:/package-lock.json" \
    node:22.15.0-alpine npm i --package-lock-only \
  && docker compose build "$@"
}

main "$@"

exit $?

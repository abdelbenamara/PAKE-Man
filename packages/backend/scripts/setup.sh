#!/bin/bash

set -eo pipefail

generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

main() {
  {
    echo "PAKE_MAN_COOKIE_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_CSRF_PROTECTION_HMAC_KEY=\"$(generate_key)\""
    echo "PAKE_MAN_PRISMA_DATABASE_URL=\"file:$(pwd)/data/pake-man.db\""
    echo "PAKE_MAN_JWT_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_SERVER_CLOSE_GRACE_DELAY=\"1000\""
    echo "PAKE_MAN_SERVER_HOST=\"127.0.0.1\""
    echo "PAKE_MAN_SERVER_PORT=\"3001\""
  } > .env
}

main

exit $?

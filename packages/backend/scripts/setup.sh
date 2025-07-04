#!/bin/bash

set -eo pipefail

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

main() {
  mkdir -p "$parentdir/data"

  {
    echo "PAKE_MAN_COOKIE_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_CSRF_PROTECTION_HMAC_KEY=\"$(generate_key)\""
    echo "PAKE_MAN_JWT_SECRET_ACCESS=\"$(generate_key)\""
    echo "PAKE_MAN_JWT_SECRET_QUERY=\"$(generate_key)\""
    echo "PAKE_MAN_JWT_SECRET_REFRESH=\"$(generate_key)\""
    echo "PAKE_MAN_MAIL_TRANSPORT_HOST=\"maildev\""
    echo "PAKE_MAN_MAIL_TRANSPORT_PORT=\"1025\""
    echo "PAKE_MAN_OTP_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_PRISMA_DATABASE_URL=\"file:$(pwd)/data/pake-man.db\""
    echo "PAKE_MAN_SERVER_CLOSE_GRACE_DELAY=\"1000\""
    echo "PAKE_MAN_SERVER_HOST=\"127.0.0.1\""
    echo "PAKE_MAN_SERVER_PORT=\"3001\""
  } > .env
}

main

exit $?

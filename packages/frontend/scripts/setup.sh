#!/bin/sh

set -eo pipefail

generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

main() {
  {
    echo "PAKE_MAN_COOKIE_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_DOMAIN_NAME=\"pake-man.fun\""
    echo "PAKE_MAN_SERVER_CLOSE_GRACE_DELAY=\"1000\""
    echo "PAKE_MAN_SERVER_HOST=\"127.0.0.1\""
    echo "PAKE_MAN_SERVER_PORT=\"3000\""
  } > .env
}

main

exit $?

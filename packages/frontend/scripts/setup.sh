#!/bin/sh

set -eo pipefail

main() {
  {
    echo "PAKE_MAN_SERVER_CLOSE_GRACE_DELAY=\"1000\""
    echo "PAKE_MAN_SERVER_HOST=\"127.0.0.1\""
    echo "PAKE_MAN_SERVER_PORT=\"3000\""
  } > .env
}

main

exit $?

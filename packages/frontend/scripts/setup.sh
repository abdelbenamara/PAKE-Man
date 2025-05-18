#!/bin/sh

set -eo pipefail

main() {
  {
    echo "SERVER_HOST=\"127.0.0.1\""
    echo "SERVER_PORT=\"3000\""
    echo "SERVER_CLOSE_GRACE_DELAY=\"1000\""
  } > .env
}

main

exit $?

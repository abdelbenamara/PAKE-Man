#!/bin/bash

set -eo pipefail

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

main() {
	{
    echo "PAKE_MAN_COOKIE_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_DOMAIN_NAME=\"pake-man.fun\""
	} > .env
  for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			make -C "$pkg" setup; \
		fi; \
	done
	echo "Setup completed for all packages."
}

main

exit $?

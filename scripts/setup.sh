#!/bin/bash

set -eo pipefail

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

main() {
  for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			make -C "$pkg" setup; \
		fi; \
	done
	echo "Setup completed for all packages."
}

main

exit $?

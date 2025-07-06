#!/bin/bash

set -eo pipefail

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

main() {
  for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			rm -f "$pkg/package-lock.json" ; \
		fi; \
	done
	echo "Cleaned package-lock.json files in all packages."
}

main "$@"

exit $?

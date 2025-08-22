#!/bin/bash

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

main() {
  for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			make -C "$pkg" clean; \
		fi; \
	done
	echo "Cleaned package-lock.json files in all packages."
}

main "$@"

exit $?

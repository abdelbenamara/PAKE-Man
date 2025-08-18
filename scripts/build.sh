#!/bin/bash

scriptdir=$(dirname "$0")
parentdir=$(cd "$scriptdir/.." && pwd)

main() {
  for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			make -C "$pkg" build "$@"; \
		fi; \
	done
	echo "Build completed for all packages."
}

main "$@"

exit $?

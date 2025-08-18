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
    echo "PAKE_MAN_CSRF_PROTECTION_HMAC_KEY=\"$(generate_key)\""
    echo "PAKE_MAN_DOMAIN_NAME=\"pake-man.fun\""
	} > .env
  
	for pkg in $parentdir/packages/*/; do \
		if [ -d "$pkg" ]; then \
			make -C "$pkg" setup; \
		fi; \
	done

	python3 -m venv venv \
        && source venv/bin/activate \
        && pip install --upgrade pip \
				&& pip install --upgrade ansible-core passlib \
        && ansible-galaxy collection install --upgrade \
            community.general community.crypto \
				&& ansible-playbook $scriptdir/ssl-certificates-setup.yml --ask-become-pass

	echo "Setup completed for all packages."
}

main

exit $?

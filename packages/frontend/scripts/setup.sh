#!/bin/sh

generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

main() {
  {
    echo "PAKE_MAN_OAUTH2_GOOGLE_CALLBACK_URI=\"http://127.0.0.1:3000/login/google/callback\"";
    echo "PAKE_MAN_COOKIE_SECRET=\"$(generate_key)\""
    echo "PAKE_MAN_SERVER_CLOSE_GRACE_DELAY=\"1000\""
    echo "PAKE_MAN_SERVER_HOST=\"127.0.0.1\""
    echo "PAKE_MAN_SERVER_PORT=\"3000\""
  } > .env
}

main

exit $?

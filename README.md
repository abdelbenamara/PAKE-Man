[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# PAKE-Man

42 ft_transcendence project

## Build

**Required** environment variables:

- _PAKE_MAN_OAUTH2_GOOGLE_CALLBACK_URI_
- _PAKE_MAN_OAUTH2_GOOGLE_CLIENT_ID_
- _PAKE_MAN_OAUTH2_GOOGLE_CLIENT_SECRET_

In **each** package directory:

```shell
touch package-lock.json \
&& docker run \
-e "NODE_ENV=production" \
-v "$(pwd)/package.json:/package.json:ro" \
-v "$(pwd)/package-lock.json:/package-lock.json" \
node:22.15.0-alpine npm i --package-lock-only \
&& ./scripts/setup.sh \
&& docker compose build [--no-cache]
```

## Usage

To **build** and **start**:

```shell
docker compose up [--build] [-d]
```

To **monitor**:

```shell
docker compose logs [-f]
```

To **stop** and **clean**:

```shell
docker compose down [--rmi all] [--volumes]
```

## Contribute

Recommend VSCode extensions:

- Build with [Lit](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
- Edit with [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
- Format with [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Lint with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Style with [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- ORM with [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

## License

[MIT](LICENSE)

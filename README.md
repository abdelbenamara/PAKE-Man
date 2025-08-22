[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# PAKE-Man

42 ft_transcendence project

## Build

**Required** environment variables:

- _PAKE_MAN_OAUTH2_GOOGLE_CLIENT_ID_
- _PAKE_MAN_OAUTH2_GOOGLE_CLIENT_SECRET_

In **root** directory or **each** package directory:

```console
$ make build
```

## Usage

To **build** and **start**:

```console
$ docker compose up [--build] [-d] [--remove-orphans]
```

To **monitor**:

```console
$ docker compose logs [-f]
```

To **stop** and **clean**:

```console
$ docker compose down [--rmi all] [--volumes]
```

To **use** and **analyze**:

- Web app: https://127.0.0.1:8443
- Pong game: https://127.0.0.1:8443/pong
- Backend API docs: https://127.0.0.1:8443/backend/api/docs/
- Kibana: https://127.0.0.1:8443/kibana/

## Contribute

Recommend VSCode extensions:

- Build with [Lit](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
- Edit with [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
- Format with [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- Lint with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Style with [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- ORM with [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- Storage with [SQLite](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer)

## License

[MIT](LICENSE)

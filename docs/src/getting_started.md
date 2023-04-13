# Getting Started

## Installation

If you have not done so already, please install the following dependencies:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the application

To start the application, use the command:

```bash
HOST_UID="$(id -u)" PY_VER=3.8 IMAGE=djbase DISTRO=alpine PHARUS_VERSION=$(cat pharus/pharus/version.py | tail -1 | awk -F\" '{print $2}') docker compose up --build
```

To stop the application, use the same command as before but with `down` in place of `up --build`

## OIDC Authentication

To authenticate via OIDC, the following environment variables must be set in the `.env`:
```
PHARUS_OIDC_CLIENT_SECRET=
PHARUS_OIDC_CLIENT_ID=
PHARUS_OIDC_REDIRECT_URI=
PHARUS_OIDC_CODE_VERIFIER=
PHARUS_OIDC_TOKEN_URL=
PHARUS_OIDC_PUBLIC_KEY=
```
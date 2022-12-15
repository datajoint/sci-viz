# Getting Started

## Installation

If you have not done so already, please install the following dependencies:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Prerequisites

Before running the application through docker, make sure to run the command:

```bash
python frontend_gen.py
```

This will compile the necessary typescript files for the frontend and the necessary python files for the backend.
you can also run this at any time during a dev deployment to hot-load the frontend, however this is not always guaranteed to work as some changes may require the entire react server to restart. Anything related to the back end api is not hot-loadable but for example the component locations and sizes can be modified and hot-loaded.

Also see the _.env_ section to set up your environment variables.

## Running the application

To start the application in dev mode, use the command:

```bash
PY_VER=3.8 IMAGE=djbase DISTRO=alpine PHARUS_VERSION=$(cat pharus/pharus/version.py | tail -1 | awk -F\' '{print $2}') HOST_UID=$(id -u) docker-compose up --build
```

To run the application in Production mode, use the command:

```bash
docker-compose -f docker-compose-deploy.yaml up --build
```

To stop the application, use the same command as before but with `down` in place of `up --build`

# sci-viz
![demo image failed](src/logo.svg)

Generic visualization framework for building dashboarding capabilities for DataJoint pipelines.

## Running the application
Before running the application through docker, make sure to run the command:
```
python frontend_gen.py
```
This will compile the necessary typescript files for the frontend.
you can also run this at any time during a dev deployment to hot-load the frontend, however this is not always guaranteed to work as some changes may require the entire react server to restart.

To start the application in dev mode, use the command:
```bash
PY_VER=3.8 IMAGE=djbase DISTRO=alpine PHARUS_VERSION=$(cat pharus/pharus/version.py | tail -1 | awk -F\' '{print $2}') HOST_UID=$(id -u) docker-compose up --build
```

To stop the application, use the command:
```bash
PY_VER=3.8 IMAGE=djbase DISTRO=alpine PHARUS_VERSION=$(cat pharus/pharus/version.py | tail -1 | awk -F\' '{print $2}') HOST_UID=$(id -u) docker-compose down
```

## Dynamic spec sheet
Sci-Vis is used to build visualization dashboards, this is done through a single spec sheet.

Important notes about restrictions in the spec sheet:
- page names under pages must have a unique name without spaces
- page routes must be unique
- grid names under grids must be unique
- component names under components must be unique
- the routes of individual components must be unique
- routes must start with a `/`
- every query needs a restriction, below is the default one.
    - ```python
        def restriction(**kwargs):
        return dict(**kwargs)
    ```
- 
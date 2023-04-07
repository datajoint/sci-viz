# Dynamic Spec Sheet

Sci-Viz is used to build visualization dashboards, this is done through a single spec sheet. An example spec sheet named `test_spec.yaml` is included in the `test` directory.

Important notes about restrictions in the spec sheet:

- Page names under pages must have a unique name without spaces
- Page routes must be unique
- Grid names under grids must be unique without spaces
- Component names under components must be unique **but can have spaces**
- The routes of individual components must be unique
- Routes must start with a `/`
- Every query needs a restriction, below is the default one.
  - ```python
        def restriction(**kwargs):
            return dict(**kwargs)
    ```
- Overlapping components at the same (x, y) does not work, the grid system will not allow overlapping components it will wrap them horizontally if there is enough space or bump them down to the next row.
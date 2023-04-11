# Dynamic Spec Sheet

SciViz is used to build visualization dashboards, this is done through a single spec sheet. An example spec sheet named `test_spec.yaml` is included in the `test` directory.

## Format

The SciViz spec sheet consists of some top level keys that are used to configure various options, as well as a `pages` key, which consists of a dictionary of `grids`, which contains a dictionary of `components`. A basic outline of the spec sheet's layout is provided below, where optional keys are followed by a `?`:
```
SciViz:
  auth:
    mode:
    endpoint?:
    database?:
    client_id?:
  pages: {
    grids: {
      components: {}
    }
  }
  route?:
  website_title?:
  favicon_name?:
  hostname?:
  header?:
    image_route:
    text:
  login?:
    image_route:
  datadog?:
    applicationId:
    clientToken:
    service:
version?:
```

 - `auth` - Config values for authentication
   - `mode` - The authentication mode: **database** | **oidc** | **none**
   - `endpoint` - The endpoint to connect to for oidc authentication
   - `database` - The database for oidc authentication
   - `client_id` - The client ID for oidc authentication
 - `pages` - A dictionary of page objects. View the [Pages](./pages.md) section for more information
   - `grids` - A dictionary of grid objects. View the [Grids](./grids.md) section for more information
     - `components` - A dictionary of component objects. View the [Components](./components.md) section for more information
 - `route` - The route for SciViz to be hosted at
 - `website_title` - The title of the SciViz webpage
 - `favicon_name` - The path to a valid favicon file relative to the `public` folder
 - `hostname` - The name of the database host to preset the login page
 - `header` - Config values for the header banner
   - `image_route` - The path to a valid image file relative to the `public` folder
   - `text` - The text to display at the header
 - `login` - Config values for the login page
   - `image_route` - The path to a valid image file relative to the `public` folder
 - `datadog` - Config values to enable datadog RUM
   - `applicationId` - The ID of the datadog application to connect to
   - `clientToken` - The datadog client token associated with the application
   - `service` - The name of the datadog application

## Important Notes

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
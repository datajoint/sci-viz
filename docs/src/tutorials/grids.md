# Grids

Sci-Viz produces custom visualizations by putting `grids` on `pages` and then filling them with visualization `components`. Currently there are two types of grids **Fixed** and **Dynamic**

### Fixed mode grid

A fixed mode grid requires all components to explicitly give their position and size on the grid.

A fixed `grid` takes four arguments:

- `type:` indicates the type of grid, in this case `type: fixed`
- `columns:` the number of columns that the grid will have
- `row_height:` the height of each row in pixels
- `components:` a yaml dictionary of components to be spawned in the grid

### Dynamic grid mode

A dynamic grid takes a datajoint query and then uses each record and applies that record as a restriction to a template of components. It then spawns a single or group of components for each record of that parent query but the components query is restricted by the entire record that has been passed in from the parent query.

An example of this would be as follows:

- You have one table that represents all identifying data of a subject, lets use Mouse as an example for the subject and the table name
- You also have a table that contains a single plot per Mouse primary key, lets call this table MousePlots
- You have no idea how many plots are in MousePlots but you want to display a live view of all of them
- What you can do is create a dynamic grid with the parent query being for the Mouse table and a plot component with a query for the MousePlot table. This will produce all of the plots that are available without knowing how many there are in the database.

A dynamic `grid` takes seven arguments:

- `type:` indicates the type of grid, in this case `type: fixed`
- `columns:` the number of columns that the grid will have
- `row_height:` the height of each row in pixels
- `restriction:` a restriction for the datajoint query
- `dj_query:` the parent datajoint query that will provide the restriction records
- `route:` backend api route for the parent query
- `component_templates:` a yaml dictionary of components that serve as a template

Additionally any components in the dynamic grid do not need `x`, `y` , `height`, and `width` fields.

Currently only the `metadata` and `plot` components are supported in dynamic mode.

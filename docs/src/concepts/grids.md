# Grids

There are two types of grids **Fixed** and **Dynamic**

## Fixed grid

A fixed grid object requires all components to explicitly give their position and size on the grid. It consists of four keys:
```
Grid name:
  type: fixed
  columns:
  row_height:
  components: {}
```
- `type` - Indicates the type of grid, in this case `type: fixed`
- `columns` - The number of columns that the grid will have
- `row_height` - The height of each row in pixels
- `components` - A dictionary of component objects. View the [Components](./components.md) section for more information

## Dynamic grid

A dynamic grid takes a datajoint query and then uses each record and applies that record as a restriction to a template of components. It then spawns a single or group of components for each record of that parent query but the components query is restricted by the entire record that has been passed in from the parent query.

An example of this would be as follows:

- You have one table that represents all identifying data of a subject, lets use Mouse as an example for the subject and the table name
- You also have a table that contains a single plot per Mouse primary key, lets call this table MousePlots
- You have no idea how many plots are in MousePlots but you want to display a live view of all of them
- What you can do is create a dynamic grid with the parent query being for the Mouse table and a plot component with a query for the MousePlot table. This will produce all of the plots that are available without knowing how many there are in the database.

A dynamic grid object can consist of eight keys:
```
Grid name:
  type: fixed
  columns:
  row_height:
  route:
  component_templates: {}
  restriction:
  dj_query:
  channels?
```

- `type` - Indicates the type of grid, in this case `type: dynamic`
- `columns` - The number of columns that the grid will have
- `row_height` - The height of each row in pixels
- `route` - The backend api route for the parent query
- `component_templates` - A dictionary of component objects that serve as a template. Currently only the `metadata` and `plot` components are supported in dynamic mode
- `restriction` - A restriction for the datajoint query
- `dj_query` - The parent datajoint query that will provide the restriction records
- `channels` - A list of emitter components to be channeled with

Additionally any components in the dynamic grid do not need `x`, `y` , `height`, and `width` fields.



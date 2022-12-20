# Components

All components need minimally these fields:

- `type:` indicates the type of component you are trying to generate
- `route:` the backend route for the rest api query, must start with a `/`
  - Note: the markdown component does not require a route
- `x:` x position on the grid starting at 0
- `y:` y position on the grid starting at 0
- `height:` the amount of grid squares tall a component can be, minimum 1
- `width:` the amount of grid square wide a compoentnt can be, minimum 1

## Table component

`type:` table

The Table component takes a two additional fields:

- `restriction:` the restriction for the datajoint query
- `dj_query:` the datajoint query for for the table data

If setup correctly the component will render the result of the query in a table that supports paging, sorting, and filtering.

### Adding color to your tables using projections

```python
def dj_query(vms):
    TableA, TableB = (vms['test_group1_simple'].TableA, vms['test_group1_simple'].TableB)
    return ((TableA * TableB).proj(...,
                                   _sciviz_font='IF(a_name = "Raphael", "rgb(255, 0, 0)", NULL)',
                                   _sciviz_background='IF(a_name = "Raphael", "rgba(50, 255, 0, 0.16)", NULL)',)
                                  ), dict(order_by='b_number')
```

This is an example of a table query that has a projection that applys a text color as well as a background color.
It does so through the use of 2 protected column names:

- `_sciviz_font` for the font color
- `_sciviz_background` for the background color
  these two fields will accept any color format that css does.

In the example we do a join of two tables and then do a projection where we create 2 new columns with the protected names and if a condition is met we set their field to a css-compatable color else we have it be `NULL`. In the example above we use rgb when we do not need transparency and rgba when we do.
[here is a good tool for picking css colors.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool)

## Markdown component

`type:` markdown

The Markdown component takes one additional field:

- `text: |`
  - underneath the `|` operator you can place any markdown text block that you want.

## Plot component from stored Plotly JSON

`type:` plot:plotly:stored_json

The Plot component takes two additional arguments:

- `restriction:` the restriction for the datajoint query
- `dj_query:` the datajoint query for for the table data.

The Plot component also takes one optional argument:

- `channels:` an array of channels to listen to for additional restrictions from other components (slider, dropdown, ect.)

Additionally for the plot to render properly the result of your query must be a single entry with one element that is a plotly JSON.
An easy way to do this is to set the `fetch_args=[]` in your `dj_query` to be only the column that contains a plotly JSON and additionaly set your restriction to be the index of the plot you are looking for

## Metadata component

`type:` metadata

The Metadata component takes two additional arguments:

- `restriction:` the restriction for the datajoint query
- `dj_query:` the datajoint query for for the table data.

Additionally the metadata component only takes a single row from a table as its input so the `dj_query` and `restriction` need to be properly set to produce a single record. This component is not very useful by itself but when combined with other components as part of a template in a `Dynamic grid` it can provide useful information on what the other components are showing.

## Image component

`type:` file:image:attach

The Image component takes two additional arguments:

- `restriction:` the restriction for the datajoint query
- `dj_query:` the datajoint query for for the table data.

Additionally the image that you want to display needs to be stored as a datajoint [attach](https://docs.datajoint.org/python/definition/06.5-External-Data.html?highlight=attach) attribute type and your query should produce only one record with one column which is the column where the image is stored.

## Form component

`type:` form

The Form component takes 2 additional arguments:

- `route:` the backend route for the rest api query, must start with a `/`
- `tables:` the list of tables in "`schema.table`" format to insert into
  - Table names can be templated, either fully or partially, using the `'{keyword}'` format. This keyword can then be assigned a value by an emitter component as a query parameter.

The Form can also take 2 optional argument:

- `map:` a mapping to change the displayed names of the fields in the form

  A map takes a _list_ of 3 arguments:

  - `type:` attribute | table
  - `input:` the new name of the field
  - `destination:` the field to be renamed

  A map entry with a `table` type can also take 1 optional argument:

  - `map:` a nested mapping of the same structure to change the displayed names of the table's primary key attributes

- `channels:` an array of channels to listen to for templated table name values.

## Slider component

The Slider is a component that takes a datajoint query and creates a slider based off the payload that the query returns. It turns each record into an index on the slider and also emits the currently selected record on its channel as a restriction to other components.

`type:` slider

The Slider component takes three additional arguments:

- `restriction:` the restriction for the datajoint query.
- `dj_query:` the datajoint query for for the table data.
- `channel:` the name of the channel that the slider outputs its restriction on.

The Slider component also takes one optional argument:

- `channels:` an array of channels to listen to for restricting its own query.

## Radiobutton/Dropdown-static component

Similar to the Slider, the Radiobutton and Dropdown-static components are components that supply a selected restriction on a channel to a component that can accept them.

`type:` radiobuttons | dropdown-static

The Radiobutton/Dropdown-static components take two additional arguments:

- `channel:` the name of the channel that the Radiobutton/dropdown-static outputs its restriction on.
- `content:` dictionary of key value pairs, the key is what text is shown to the user while the value is the actual restriction.

  - Example:

  ```
  content:
    mouse 0: 'mouse_id=0'
    mouse 1: 'mouse_id=1'
    mouse 2: 'mouse_id=2'
  ```

## Dropdown-query component

The Dropdown-query component is the same as the slider component except it only expects a result with one column.

`type:` dropdown-query

The Dropdown-query component takes three additional arguments:

- `restriction:` the restriction for the datajoint query.
- `dj_query:` the datajoint query for for the table data.
- `channel:` the name of the channel that the slider outputs its restriction on.

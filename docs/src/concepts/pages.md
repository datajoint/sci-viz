# Pages

A SciViz page object consists of four keys:

- `Page_Name` - A user-defined key for the name of the page
  - `route` - A unique route for the SciViz page
  - `grids` - A dictionary of grid objects. View the [Grids](./grids.md) section for more information
  - `hidden?` - Whether or not the page is hidden: **True** | **False**

## Hidden Pages

 Hidden pages are typically used in conjunction with a linked table component. When a row of a linked table is selected, it will pass the selected primary keys as a restriction on the grids and components of the linked hidden page and display the result.
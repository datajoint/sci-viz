from textwrap import indent
from pathlib import Path
import os
import yaml

page_header = '''
import React from 'react';
import TableView from '../Table/TableView';
import GridLayout from 'react-grid-layout';
import SideBar from '../SideBar/SideBar';
import './Page.css'

interface Page1Props {
  jwtToken: string;
}
'''
export_header = '''
  export default class Page1 extends React.Component<Page1Props> {
    render() {
      return (
        <div>
          <div className='grid-container'>
            <SideBar />
            <ul>'''
grid_header = '''
              <li style={{{{display: 'block'}}}}> 
                <GridLayout className="mygrid" cols={{ {num_cols} }}    rowHeight={{400}} width={{1600}}>'''
component_template = '''
                  <div key='{component_name}' data-grid={{{{x: {x}, y: {y}, w: {width}, h: {height}, static: true}}}}>
                  <TableView token={{this.props.jwtToken}} route='{route}' tableName='{route}'/>
                  </div>'''
grid_footer = '''
                </GridLayout>
              </li>'''
export_footer= '''
            </ul>
          </div>
          
        </div>
      )
    }
  }
'''

# spec_path = os.environ.get('API_SPEC_PATH')
spec_path = 'test_spec.yaml'
side_bar_data = '/src/Components/SideBar/SideBarData.js'
page_path = 'src/Components/Pages/{page_name}.tsx'
with open(Path(spec_path), 'r') as y:
    values_yaml = yaml.load(y, Loader=yaml.FullLoader)
    pages = values_yaml['SciViz']['pages']

    # Crawl through the yaml file
    for page_name, page in pages.items():
        with open(Path(page_path.format(page_name=page_name)), 'w') as p:
            p.write(page_header + export_header)
            for grid in page['grids'].values():
                p.write(grid_header.format(num_cols=grid['columns'],
                                           row_height=grid['row_height'],
                                           row_width=grid['row_width']))
                for component_name, component in grid['components'].items():
                    p.write(component_template.format(component_name=component_name,
                                                      x=component['x'],
                                                      y=component['y'],
                                                      height=component['height'],
                                                      width=component['width'],
                                                      route=component['route']))
                p.write(grid_footer)
            p.write(export_footer)


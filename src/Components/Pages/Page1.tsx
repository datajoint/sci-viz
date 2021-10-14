import React from 'react';
import TableView from '../Table/TableView';
import GridLayout from 'react-grid-layout';
import SideBar from '../SideBar/SideBar';
import './Page.css'

interface Page1Props {
  jwtToken: string;
}

   
  /**
   * Main view for DJGUI App
   */
  export default class Page1 extends React.Component<Page1Props> {
    render() {
      return (
        <div>
          <div className='grid-container'>
            <SideBar />
            <ul>
              <li style={{display: 'block'}}>
                <GridLayout className="mygrid" cols={ 3 }  rowHeight={400} width={1600}>
                  <div key='table1' data-grid={{x: 0, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query1' tableName='test1'/>
                  </div>
                  <div key='table2' data-grid={{x: 1, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query1' tableName='test2'/>
                  </div>
                  <div key='table3' data-grid={{x: 2, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query5' tableName='test3'/>
                  </div>
                </GridLayout>
              </li>
              <li style={{display: 'block'}}>
                <GridLayout className="mygrid" cols={3} rowHeight={400} width={1600}>
                  <div key='table1' data-grid={{x: 0, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query1' tableName='test1'/>
                  </div>
                  <div key='table2' data-grid={{x: 1, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query1' tableName='test2'/>
                  </div>
                  <div key='table3' data-grid={{x: 2, y: 0, w: 1, h: 1, static: true}}>
                  <TableView token={this.props.jwtToken} route='/query5' tableName='test3'/>
                  </div>
                </GridLayout>
              </li>
            </ul>
          </div>
          
        </div>
      )
    }
  }
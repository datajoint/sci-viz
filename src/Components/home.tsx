import React from 'react';
import TableView from './Table/TableView';

// Component imports

interface HomeProps {
  jwtToken: string;
}



/**
 * Main view for DJGUI App
 */
export default class Home extends React.Component<HomeProps> {

  render() {
    return (
      <div>
        <div>
        <TableView token={this.props.jwtToken} route='/query1' tableName='test1'/>
        </div>
      </div>
    )
  }
}
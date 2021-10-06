import React from 'react';
import Table from './Table';
import TableView from './TableView';

// Component imports

interface HomeProps {
  jwtToken: string;
}


/**
 * Main view for DJGUI App
 */
export default class Home extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props);
  }

  render() {
    return (
      <div className="home-container">
        <div className="table-view-container">
          <TableView token={this.props.jwtToken}/>
        </div>
      </div>
    )
  }
}
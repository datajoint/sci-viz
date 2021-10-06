import React from 'react';
import Table from './Table';

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
          <Table/>
        </div>
      </div>
    )
  }
}
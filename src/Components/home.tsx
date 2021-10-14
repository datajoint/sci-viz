import React from 'react';
import SideBar from './SideBar/SideBar';
// Component imports
import './home.css'

interface HomeProps {
  jwtToken: string;
}

const layout = [
  {i: 'table1', x: 0, y: 0, w: 1, h: 1, static: true},
  {i: 'table2', x: 1, y: 0, w: 1, h: 1, static: true},
  {i: 'table3', x: 2, y: 0, w: 1, h: 1, static: true},
];



/**
 * Main view for DJGUI App
 */
export default class Home extends React.Component<HomeProps> {
  render() {
    return (
      <div>
        <div className='grid-container'>
          <SideBar />
          <p>Welcome to Sci-Viz!</p>
        </div>
      </div>
    )
  }
}
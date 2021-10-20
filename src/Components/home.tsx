import React from 'react';
import SideBar from './SideBar/SideBar';
// Component imports
import './home.css'

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
        <div className='grid-container'>
          <SideBar />
          <p>Welcome to Sci-Viz!</p>
        </div>
      </div>
    )
  }
}
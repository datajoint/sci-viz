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
        <SideBar />
        <div className='home-container'>
          <p>Welcome to Sci-Viz!</p>
        </div>
      </div>
    )
  }
}
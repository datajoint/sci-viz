import React from 'react'
import './Header.css'
import logo from '../../logo.svg'
interface HeaderProps {}

interface HeaderState {}

/**
 * Header component
 */
export default class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    return (
      <header>
        <img className="header-img" src={logo} alt="Sci-viz logo" />
        <div className="header-content">
          <p>
            <i style={{ paddingLeft: '20px' }}>Powered by DataJoint</i>
          </p>
        </div>
      </header>
    )
  }
}

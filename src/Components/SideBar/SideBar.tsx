import "./SideBar.css";
import React from "react";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import * as FaIcons from "react-icons/fa";

interface SideBarProps {}

interface SideBarState {
  isOpen: boolean;
}

/**
 * SideBar component
 */
export default class SideBar extends React.Component<
  SideBarProps,
  SideBarState
> {
  constructor(props: SideBarProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.showSidebar = this.showSidebar.bind(this);
  }

  showSidebar(isOpen: boolean) {
    if (isOpen === false) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <nav className={this.state.isOpen ? "nav-menu active" : "nav-menu"}>
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars onClick={() => this.showSidebar(this.state.isOpen)} />
        </Link>
        <ul
          className={
            this.state.isOpen ? "nav-menu-items active" : "nav-menu-items"
          }
        >
          {SideBarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

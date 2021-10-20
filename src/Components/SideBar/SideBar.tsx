import './SideBar.css'
import React from 'react';
import { Link } from 'react-router-dom';
import {SideBarData} from './SideBarData'

interface SideBarProps {
}

interface SideBarState {
}


/**
 * SideBar component
 */
export default class SideBar extends React.Component<SideBarProps, SideBarState> {  
    render() {
        return (
            <nav className='nav-menu'>
                <ul className='nav-menu-items'>
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
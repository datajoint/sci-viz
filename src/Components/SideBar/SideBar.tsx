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
                {SideBarData.map((item, index) => {
                    return (
                        <ul className='nav-menu-items'>
                            <li key={index} className={item.cName}>
                            <Link to={item.path}>
                            <span>{item.title}</span>
                            </Link>
                            </li>
                        </ul>
                    );
                })}
            </nav>
        );
    }
}
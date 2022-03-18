import './MenuBar.css'
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuBarData } from './MenuBarData'
import { Menu } from 'antd'

interface MenuBarProps {}

interface MenuBarState {
  isOpen: boolean
}

/**
 * MenuBar component
 */
export default class MenuBar extends React.Component<
  MenuBarProps,
  MenuBarState
> {
  constructor(props: MenuBarProps) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }
  render() {
    return (
      <Menu mode="horizontal">
        {MenuBarData.map((item, index) => {
          return (
            <Menu.Item danger={true}>
              <Link to={item.path}>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
}

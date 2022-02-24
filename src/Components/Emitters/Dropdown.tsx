import { Menu, Dropdown, Button, Card, Space } from 'antd'
import React from 'react'
import { DownOutlined } from '@ant-design/icons'

interface DropdownProps {
  /**Determines the key for the restriction store*/
  channel: string
  height: number
  payload: Object
  updatePageStore: (key: string, record: Array<string>) => void
}

interface DropdownState {
  currentSelection: string
}

export default class DjDropdown extends React.Component<
  DropdownProps,
  DropdownState
> {
  constructor(props: DropdownProps) {
    super(props)
    this.state = {
      currentSelection: Object.entries(this.props.payload)[0][0],
    }

    this.onClick = this.onClick.bind(this)
    this.getMenu = this.getMenu.bind(this)
    this.props.updatePageStore(this.props.channel, [
      Object.entries(this.props.payload)[0][1],
    ])
  }

  onClick = ({ key }: { key: string }) => {
    this.props.updatePageStore(this.props.channel, [key])
    this.setState({ currentSelection: key })
  }
  getMenu() {
    return (
      <Menu onClick={this.onClick}>
        {Object.entries(this.props.payload).map((value) => {
          return (
            <Menu.Item key={value[1]} title={value[1]}>
              {value[0]}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  render() {
    return (
      <Card
        style={{
          height: this.props.height,
        }}
        bodyStyle={{ overflow: 'auto', height: '100%' }}
        hoverable={true}
      >
        <Space
          align="center"
          style={{ width: '100%', height: '100%', justifyContent: 'center' }}
        >
          <Dropdown overlay={this.getMenu()}>
            <Button>
              {this.state.currentSelection} <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      </Card>
    )
  }
}

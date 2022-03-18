import { Menu, Dropdown, Button, Card, Space } from 'antd'
import React from 'react'
import { DownOutlined } from '@ant-design/icons'

interface djRecords {
  recordHeader: Array<string>
  records: Array<Array<string>>
  totalCount: number
}

interface DropdownQueryProps {
  /**Determines the key for the restriction store*/
  channel: string
  height: number
  route: string
  token: string
  updatePageStore: (key: string, record: Array<string>) => void
}

interface DropdownQueryState {
  currentSelection: string
  data: djRecords
}

export default class DjDropdownQuery extends React.Component<
  DropdownQueryProps,
  DropdownQueryState
> {
  constructor(props: DropdownQueryProps) {
    super(props)
    this.state = {
      data: { recordHeader: [], records: [[]], totalCount: 0 },
      currentSelection: '',
    }

    this.getRecords = this.getRecords.bind(this)
    this.onClick = this.onClick.bind(this)
    this.getMenu = this.getMenu.bind(this)
  }
  getRecords(): Promise<djRecords> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((result) => {
        return result.json()
      })
      .then((result) => {
        return result as Promise<djRecords>
      })
  }
  componentDidMount() {
    this.getRecords()
      .then((records) => {
        this.setState({ data: records })
        return records
      })
      .then((records) => {
        this.props.updatePageStore(this.props.channel, [
          records.recordHeader[0] + '=' + records.records[0][0],
        ])
        this.setState({ currentSelection: records.records[0][0] })
      })
  }
  onClick = ({ key }: { key: string }) => {
    this.props.updatePageStore(this.props.channel, [key])
    this.setState({ currentSelection: key.split('=')[1] })
  }
  getMenu() {
    return (
      <Menu onClick={this.onClick}>
        {this.state.data.records.map((value) => {
          return (
            <Menu.Item
              key={this.state.data.recordHeader[0] + '=' + value[0]}
              title={this.state.data.recordHeader[0]}
            >
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

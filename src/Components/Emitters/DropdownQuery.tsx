import { Dropdown, Button, Card, Space, MenuProps } from 'antd'
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
    databaseHost?: string
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
            currentSelection: ''
        }

        this.getRecords = this.getRecords.bind(this)
        this.onClick = this.onClick.bind(this)
        this.getItems = this.getItems.bind(this)
    }
    getRecords(): Promise<djRecords> {
        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route

        if (this.props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${this.props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.props.token
            }
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
                    records.recordHeader[0] + '=' + records.records[0][0]
                ])
                this.setState({ currentSelection: records.records[0][0] })
            })
    }
    onClick = ({ key }: { key: string }) => {
        this.props.updatePageStore(this.props.channel, [key])
        this.setState({ currentSelection: key.split('=')[1] })
    }
    getItems = () => {
        const items: MenuProps['items'] = this.state.data.records.map((value) => {
            return {
                label: value[0],
                key: this.state.data.recordHeader[0] + '=' + value[0],
                onClick: this.onClick
            }
        })

        return { items }
    }

    render() {
        return (
            <Card
                style={{
                    height: this.props.height
                }}
                bodyStyle={{ overflow: 'auto', height: '100%' }}
                hoverable={true}
            >
                <Space
                    align='center'
                    style={{ width: '100%', height: '100%', justifyContent: 'center' }}
                >
                    <Dropdown menu={this.getItems()} overlayStyle={{ width: '14%' }}>
                        <Button>
                            {this.state.currentSelection} <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            </Card>
        )
    }
}

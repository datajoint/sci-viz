import { Menu, Dropdown, Button, Card, Space } from 'antd'
import { useEffect, useMemo, useState } from 'react'
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

const DjDropdown = ({ channel, height, payload, updatePageStore }: DropdownProps) => {
    const [currentSelection, setCurrentSelection] = useState(Object.entries(payload)[0][0])

    useEffect(() => {
        updatePageStore(channel, [Object.entries(payload)[0][1]])
    }, [channel])

    const onClick = ({ key }: { key: string }) => {
        updatePageStore(channel, [key])
        setCurrentSelection(key)
    }

    const getMenu = useMemo(() => {
        return (
            <Menu onClick={onClick}>
                {Object.entries(payload).map((value) => {
                    return (
                        <Menu.Item key={value[1]} title={value[1]}>
                            {value[0]}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }, [onClick, payload])

    return (
        <Card
            style={{
                height: height
            }}
            bodyStyle={{ overflow: 'auto', height: '100%' }}
            hoverable={true}
        >
            <Space
                align='center'
                style={{ width: '100%', height: '100%', justifyContent: 'center' }}
            >
                <Dropdown overlay={getMenu}>
                    <Button>
                        {currentSelection} <DownOutlined />
                    </Button>
                </Dropdown>
            </Space>
        </Card>
    )
}

export default DjDropdown

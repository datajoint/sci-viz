import { Dropdown, Button, Card, Space, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'

interface DropdownProps {
    /**Determines the key for the restriction store*/
    channel: string
    height: number
    payload: Object
    updatePageStore: (key: string, record: Array<string>) => void
}

const DjDropdown = ({ channel, height, payload, updatePageStore }: DropdownProps) => {
    const [currentSelection, setCurrentSelection] = useState(Object.entries(payload)[0][0])

    useEffect(() => {
        updatePageStore(channel, [Object.entries(payload)[0][1]])
    }, [channel, payload, updatePageStore])

    const onClick = ({ key }: { key: string }) => {
        updatePageStore(channel, [key])
        setCurrentSelection(key)
    }

    const getItems = () => {
        const items: MenuProps['items'] = Object.entries(payload).map((value) => {
            return {
                label: value[0],
                key: value[1],
                onClick: onClick
            }
        })

        return { items }
    }

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
                <Dropdown menu={getItems()}>
                    <Button>
                        {currentSelection} <DownOutlined />
                    </Button>
                </Dropdown>
            </Space>
        </Card>
    )
}

export default DjDropdown

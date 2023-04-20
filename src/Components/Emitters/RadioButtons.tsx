import { Radio, Card, Space, RadioChangeEvent } from 'antd'
import React from 'react'

interface RadioButtonsProps {
    /**Determines the key for the restriction store*/
    channel: string
    height: number
    payload: Object
    updatePageStore: (key: string, record: Array<string>) => void
}

interface RadioButtonsState {
    currentSelection: string
}

export default class DjRadioButtons extends React.Component<
    RadioButtonsProps,
    RadioButtonsState
> {
    constructor(props: RadioButtonsProps) {
        super(props)
        this.state = {
            currentSelection: Object.entries(this.props.payload)[0][1]
        }

        this.onClick = this.onClick.bind(this)
        this.props.updatePageStore(this.props.channel, [
            Object.entries(this.props.payload)[0][1]
        ])
    }

    onClick = (e: RadioChangeEvent) => {
        this.props.updatePageStore(this.props.channel, [e.target.value])
        this.setState({ currentSelection: e.target.value })
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
                    <Radio.Group onChange={this.onClick} value={this.state.currentSelection}>
                        {Object.entries(this.props.payload).map((value) => {
                            return (
                                <Radio.Button key={value[1]} value={value[1]}>
                                    {value[0]}
                                </Radio.Button>
                            )
                        })}
                    </Radio.Group>
                </Space>
            </Card>
        )
    }
}

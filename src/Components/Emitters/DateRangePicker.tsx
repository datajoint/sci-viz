import { DatePicker, Card, Space } from 'antd'
import React from 'react'

interface DateRangePickerProps {
    /**Determines the key for the restriction store*/
    channel: string
    height: number
    updatePageStore: (key: string, record: Array<string>) => void
}

interface DatePickerState {
    currentSelection: string | null
}

export default class DjDateRangePicker extends React.Component<
    DateRangePickerProps,
    DatePickerState
> {
    constructor(props: DateRangePickerProps) {
        super(props)
        this.state = {
            currentSelection: null
        }

        this.onClick = this.onClick.bind(this)
        this.props.updatePageStore(this.props.channel, [])
        this.convertDateTime = this.convertDateTime.bind(this)
    }

    onClick = ({ key }: { key: string }) => {
        this.props.updatePageStore(this.props.channel, [key])
        this.setState({ currentSelection: key })
    }
    convertDateTime = (value: string | number) => {
        if (!value) return value
        else {
            let datetime = new Date(value)
            value = `${datetime.toISOString().split('T')[0]} ${
                datetime.toISOString().split('T')[1].split('.')[0]
            }`
        }
        return value
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
                    <DatePicker.RangePicker
                        format='YYYY-MM-DD HH:mm:ss'
                        showTime={true}
                        onChange={(date, timeString) => {
                            this.props.updatePageStore(this.props.channel, [
                                `startTime=${date?.[0]?.unix()}`,
                                `endTime=${date?.[1]?.unix()}`
                            ])
                        }}
                    />
                </Space>
            </Card>
        )
    }
}

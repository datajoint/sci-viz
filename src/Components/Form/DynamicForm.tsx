import {
    Card,
    Form,
    Select,
    InputNumber,
    Input,
    DatePicker,
    TimePicker,
    Button,
    Alert,
    notification,
    Spin,
    Dropdown,
    Menu
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useState } from 'react'

const ResponsiveGridLayout = WidthProvider(Responsive)
const { TextArea } = Input

interface RestrictionStore {
    [key: string]: Array<string>
}

interface formPresets {
    [presetName: string]: { [key: string]: number | string }
}

interface formProps {
    token: string
    route: string
    name: string
    height: number
    channelList?: Array<string>
    store?: RestrictionStore
    databaseHost?: string
}

interface attributeFieldData {
    type: string
    datatype: string
    name: string
    default: string | null
    store: string
}

interface tableFieldData {
    type: string
    values: Array<string>
    name: string
    default: null
    store: string
}

interface fieldsData {
    fields: Array<attributeFieldData | tableFieldData>
}

interface formPayloadData {
    [key: string]: string | number | null | { [key: string]: string | number | null }
}

function DynamicForm(props: formProps) {
    const queryClient = useQueryClient()
    const [form] = Form.useForm()
    const [currentDropdownSelection, setCurrentDropdownSelection] = useState<
        string | undefined
    >(undefined)
    const openNotification = (
        type: 'success' | 'info' | 'warning' | 'error',
        title: string,
        desc: string,
        duration: number
    ) => {
        notification[type]({
            message: title,
            description: desc,
            duration: duration,
            placement: 'top'
        })
    }
    const intRangeMap: { [key: string]: [number, number] } = {
        tinyint: [-128, 127],
        'tinyint unsigned': [0, 255],
        smallint: [-32768, 32767],
        'smallint unsigned': [0, 65535],
        mediumint: [-8388608, 8388607],
        'mediumint unsigned': [0, 16777215],
        int: [-2147483648, 2147483647],
        'int unsigned': [0, 4294967295]
    }
    let queryParamList: string[] = []
    if (props.store && props.channelList && Object.keys(props.store).length) {
        props.channelList.forEach((element) => {
            if (props.store![element] !== undefined) {
                queryParamList = queryParamList.concat(props.store![element])
            }
        })
    }

    const insertPayload = async (payload: { submissions: formPayloadData[] }) => {
        let apiUrl = `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}${
            props.route
        }?${queryParamList.join('&')}`

        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + props.token
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    response.text().then((text) => {
                        let lastError = text.split('raise').pop()
                        let customErrorMap: { [key: string]: string } = {
                            'datajoint.errors.DuplicateError':
                                'This entry already exists in the database'
                        }
                        for (const err in customErrorMap) {
                            if (text.includes(err)) lastError = customErrorMap[err]
                        }

                        openNotification('error', 'Insert failed!', lastError!, 10)
                    })
                    return Promise.reject('Insert failed!')
                }
                return response
            })
            .then((response) => {
                openNotification('success', 'Insert successful!', '', 3)
                return response.json()
            })
    }
    const { mutate: insert, isLoading: insertLoading } = useMutation(insertPayload, {
        onSuccess: () => {
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey.includes('_form') && query.isActive()
            })
        }
    })

    const getFormFieldData = async (): Promise<fieldsData> => {
        let apiUrl = `${
            process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX
        }${props.route!}/fields?${queryParamList.join('&')}`

        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        }).then((result) => {
            return result.json()
        })
    }

    const getFormPresetData = async (): Promise<formPresets> => {
        let apiUrl = `${
            process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX
        }${props.route!}/presets?${queryParamList.join('&')}`

        if (props.databaseHost) {
            apiUrl = apiUrl.concat(`&database_host=${props.databaseHost}`)
        }

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        }).then((result) => {
            return result.json()
        })
    }

    const { data: fieldData, status } = useQuery(
        `${props.route}_form${queryParamList.length ? `:${queryParamList}` : ''}`,
        getFormFieldData,
        {
            enabled: !(
                props.store &&
                props.channelList &&
                !props.channelList.every((val) => Object.keys(props.store!).includes(val))
            )
        }
    )

    const presets = useQuery(
        `${props.route}_presets${queryParamList.length ? `:${queryParamList}` : ''}`,
        getFormPresetData,
        {
            enabled: !(
                props.store &&
                props.channelList &&
                !props.channelList.every((val) => Object.keys(props.store!).includes(val))
            )
        }
    )

    const handleSubmit = async (values: formPayloadData) => {
        fieldData!.fields.forEach((field) => {
            if (field.type === 'table') {
                values = Object.assign(values, JSON.parse(values[field.name] as string))
                delete values[field.name]
            } else if (/^date.*|time.*$/.test((field as attributeFieldData).datatype))
                values[field.name] = convertDateTime(
                    field.store,
                    (field as attributeFieldData).datatype
                )
        })
        let payload = {
            submissions: [values]
        }
        insert(payload)
    }

    const generateDropdown = (presetPayload: formPresets) => {
        let menu = (
            <Menu
                onClick={(value) => {
                    form.setFieldsValue(presetPayload[value.key])
                    setCurrentDropdownSelection(value.key)
                }}
            >
                {Object.entries(presetPayload).map((value) => {
                    return (
                        <Menu.Item key={value[0]} title={value[0]}>
                            {value[0]}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
        return (
            <Dropdown overlay={menu}>
                <Button>
                    {currentDropdownSelection ? currentDropdownSelection : <>Presets</>}{' '}
                    <DownOutlined />
                </Button>
            </Dropdown>
        )
    }

    const convertDateTime = (value: string | number, type: string) => {
        if (!value) return value
        else if (/^datetime.*|timestamp.*$/.test(type)) {
            let datetime = new Date(value)
            value = `${datetime.toISOString().split('T')[0]} ${
                datetime.toISOString().split('T')[1].split('.')[0]
            }`
        } else if (/^date.*$/.test(type)) {
            let date = new Date(value)
            value = date.toISOString().split('T')[0]
        } else if (/^time.*$/.test(type)) {
            let time = new Date(`1970-01-01 ${value}`)
            value = time.toISOString().split('T')[1].split('.')[0]
        }
        return value
    }

    const generateFieldItem = (field: attributeFieldData | tableFieldData) => {
        if (field.type === 'table') {
            let tableField = field as tableFieldData
            return (
                <Select style={{ width: '100%' }}>
                    {tableField.values.map((option) => (
                        <Select.Option value={option} key={`${tableField.name}_select_option`}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            )
        }
        let attrField = field as attributeFieldData
        if (/^.*int.*$/.test(attrField.datatype)) {
            let range = intRangeMap[attrField.datatype]
            return (
                <InputNumber
                    id={attrField.name}
                    min={range[0]}
                    max={range[1]}
                    precision={0}
                    style={{ width: '100%' }}
                />
            )
        } else if (/^float.*|double.*|decimal.*$/.test(attrField.datatype)) {
            return <InputNumber id={attrField.name} style={{ width: '100%' }} />
        } else if (/^char.*|varchar.*$/.test(attrField.datatype)) {
            let size = Number(attrField.datatype.split('(')[1].replace(')', ''))
            if (size >= 255) {
                return (
                    <TextArea
                        id={attrField.name}
                        maxLength={size}
                        showCount
                        autoSize={{ maxRows: 3 }}
                        style={{ width: '100%' }}
                    />
                )
            }
            return (
                <Input
                    id={attrField.name}
                    showCount
                    maxLength={size}
                    style={{ width: '100%' }}
                />
            )
        } else if (/^enum.*$/.test(attrField.datatype)) {
            let options = attrField.datatype
                .split('(')[1]
                .replace(')', '')
                .replaceAll("'", '')
                .split(',')
            return (
                <Select id={attrField.name} style={{ width: '100%' }}>
                    {options.map((option) => (
                        <Select.Option value={option} key={`${attrField.name}_select_option`}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            )
        } else if (/^datetime.*|timestamp.*$/.test(attrField.datatype))
            return (
                <DatePicker
                    showTime
                    id={attrField.name}
                    style={{ width: '100%' }}
                    onChange={(value, dateString) => (field.store = dateString)}
                />
            )
        else if (/^date.*$/.test(attrField.datatype))
            return (
                <DatePicker
                    id={attrField.name}
                    style={{ width: '100%' }}
                    onChange={(value, dateString) => (field.store = dateString)}
                />
            )
        else if (/^time.*$/.test(attrField.datatype))
            return (
                <TimePicker
                    id={attrField.name}
                    style={{ width: '100%' }}
                    onChange={(value, timeString) => (field.store = timeString)}
                />
            )
        else return <>Datatype not yet supported</>
    }

    if (
        status === 'loading' ||
        (props.store &&
            props.channelList &&
            !props.channelList.every((val) => Object.keys(props.store!).includes(val)))
    ) {
        return <Spin size='default' />
    } else if (status === 'error') {
        return <Alert message='Form failed to generate' type='error' />
    }
    let layout5 = fieldData!.fields.map((field, i) => {
        return { i: field.name, x: i % 5, y: Math.floor(i / 5), w: 1, h: 1 }
    })
    let layout3 = fieldData!.fields.map((field, i) => {
        return { i: field.name, x: i % 3, y: Math.floor(i / 3), w: 1, h: 1 }
    })
    return (
        <Card
            title={props.name}
            extra={
                presets.status == 'loading' ? (
                    <Spin />
                ) : presets.status == 'error' ? (
                    <></>
                ) : (
                    generateDropdown(presets.data!)
                )
            }
            style={{ width: '100%', height: props.height }}
            bodyStyle={{
                height: `${((props.height - 57.13) / props.height) * 100}%`, // 57.13 is the height of the title element
                overflowY: 'auto'
            }}
            hoverable={true}
        >
            <Form
                form={form}
                name='Multi-table Insert'
                layout='vertical'
                onFinish={handleSubmit}
                disabled={insertLoading}
            >
                <ResponsiveGridLayout
                    className='formGrid'
                    rowHeight={100}
                    autoSize={true}
                    isDraggable={false}
                    isResizable={false}
                    breakpoints={{ lg: 1200, md: 800 }}
                    cols={{ lg: 5, md: 3 }}
                    layouts={{ lg: layout5, md: layout3 }}
                >
                    {fieldData!.fields.map((field) => (
                        <div key={field.name}>
                            <Form.Item
                                style={{ margin: 0, padding: 0 }}
                                label={field.name}
                                name={field.name}
                                rules={[
                                    {
                                        required: !field.default
                                    }
                                ]}
                            >
                                {generateFieldItem(field)}
                            </Form.Item>
                            {field.hasOwnProperty('datatype') &&
                            /^datetime\(\d+\)|time.*\(\d+\)$/.test(
                                (field as attributeFieldData).datatype
                            ) ? (
                                <Alert
                                    style={{ margin: 0, padding: 0 }}
                                    message='Time precision will be rounded to the second'
                                    type='warning'
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </ResponsiveGridLayout>
                <Form.Item>
                    <Button
                        type='primary'
                        size='large'
                        shape='round'
                        htmlType='submit'
                        loading={insertLoading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default DynamicForm

import React, { useState } from 'react'
import {
  Form,
  Select,
  InputNumber,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Alert,
  notification,
  Typography,
  Space,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useQuery, useMutation, useQueryClient } from 'react-query'

library.add(faSpinner, faPlusCircle)
const { TextArea } = Input
const { Title } = Typography

interface formProps {
  token: string
  route: string
}

interface attributeFieldData {
  type: string
  datatype: string
  name: string
  default: string | null
}

interface tableFieldData {
  type: string
  values: Array<object>
  name: string
  default: null
}

interface fieldsData {
  fields: Array<attributeFieldData | tableFieldData>
}

interface formPayloadData {
  [key: string]:
    | string
    | number
    | null
    | { [key: string]: string | number | null }
}

function DynamicForm(props: formProps) {
  const queryClient = useQueryClient()
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
      placement: 'top',
    })
  }
  const [formPayload, setFormPayload] = useState<formPayloadData>({})
  const intRangeMap: { [key: string]: [number, number] } = {
    tinyint: [-128, 127],
    'tinyint unsigned': [0, 255],
    smallint: [-32768, 32767],
    'smallint unsigned': [0, 65535],
    mediumint: [-8388608, 8388607],
    'mediumint unsigned': [0, 16777216],
    int: [-2147483648, 2147483647],
    'int unsigned': [0, 4294967295],
  }

  const insertPayload = async (payload: { submissions: formPayloadData[] }) => {
    let apiUrl = `/api/${props.route}` //?organization=${props.org}&project=${props.workflow!.wfs_name}`
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            let lastError = text.split('raise').pop()
            let customErrorMap: { [key: string]: string } = {
              'datajoint.errors.DuplicateError':
                'This entry already exists in the database',
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
  const { mutate: insert, isLoading: insertLoading } = useMutation(
    insertPayload,
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          predicate: (query) => query.queryKey.includes('_form'),
        })
      },
    }
  )

  const getFormFieldData = async (): Promise<fieldsData> => {
    let apiUrl = `/api/${props.route!}` //fields?organization=${props.org}&project=${props.workflow!.wfs_name}`
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + props.token,
      },
    }).then((result) => {
      return result.json()
    })
  }
  const { data: fieldData, status } = useQuery(
    `${props.route}_form`,
    getFormFieldData
  )

  const handleSubmit = async () => {
    let payload = {
      submissions: [formPayload],
    }
    insert(payload)
  }

  const handleTableChange = (value: string) => {
    const tableValues = JSON.parse(value)
    setFormPayload({
      ...formPayload,
      ...tableValues,
    })
  }

  const handleAttrChange = (value: string | number | null, key: string) => {
    setFormPayload({
      ...formPayload,
      [key]: value,
    })
  }

  const convertDateTime = (value: string | number, type: string) => {
    if (!value) return value
    else if (type === 'date') {
      let date = new Date(value)
      value = date.toISOString().split('T')[0]
    } else if (type === 'time') {
      let time = new Date(`1970-01-01 ${value}`)
      value = time.toISOString().split('T')[1].split('.')[0]
    } else if (type === 'datetime') {
      let datetime = new Date(value)
      value = `${datetime.toISOString().split('T')[0]} ${
        datetime.toISOString().split('T')[1].split('.')[0]
      }`
    }
    return value
  }

  const generateFieldItem = (field: attributeFieldData | tableFieldData) => {
    if (field.type === 'table') {
      let tableField = field as tableFieldData
      return (
        <Select style={{ width: '100%' }} onChange={handleTableChange}>
          {tableField.values.map((option) => (
            <Select.Option value={JSON.stringify(option)}>
              {JSON.stringify(option)}
            </Select.Option>
          ))}
        </Select>
      )
    }
    let attrField = field as attributeFieldData
    if (
      [
        'tinyint',
        'tinyint unsigned',
        'smallint',
        'smallint unsigned',
        'mediumint',
        'mediumint unsigned',
        'int',
        'int unsigned',
      ].includes(attrField.datatype)
    ) {
      let range = intRangeMap[attrField.datatype]
      return (
        <InputNumber
          id={attrField.name}
          min={range[0]}
          max={range[1]}
          precision={0}
          style={{ width: '100%' }}
          onChange={(value) => handleAttrChange(value, attrField.name)}
        />
      )
    } else if (
      ['float', 'double'].includes(attrField.datatype) ||
      (attrField.datatype.split('(') &&
        attrField.datatype.split('(')[0] === 'decimal')
    ) {
      return (
        <InputNumber
          id={attrField.name}
          style={{ width: '100%' }}
          onChange={(value) => handleAttrChange(value, attrField.name)}
        />
      )
    } else if (
      attrField.datatype.split('(') &&
      ['char', 'varchar'].includes(attrField.datatype.split('(')[0])
    ) {
      let size = Number(attrField.datatype.split('(')[1].replace(')', ''))
      if (size >= 255) {
        return (
          <TextArea
            id={attrField.name}
            maxLength={size}
            showCount
            autoSize={{ maxRows: 3 }}
            style={{ width: '100%' }}
            onChange={(value) =>
              handleAttrChange(value.target.value, value.target.id)
            }
          />
        )
      }
      return (
        <Input
          id={attrField.name}
          showCount
          maxLength={size}
          style={{ width: '100%' }}
          onChange={(value) =>
            handleAttrChange(value.target.value, value.target.id)
          }
        />
      )
    } else if (
      attrField.datatype.split('(') &&
      attrField.datatype.split('(')[0] === 'enum'
    ) {
      let options = attrField.datatype
        .split('(')[1]
        .replace(')', '')
        .replaceAll("'", '')
        .split(',')
      return (
        <Select
          id={attrField.name}
          style={{ width: '100%' }}
          onChange={(value) => handleAttrChange(value, attrField.name)}
        >
          {options.map((option) => (
            <Select.Option value={option}>{option}</Select.Option>
          ))}
        </Select>
      )
    } else if (['datetime', 'timestamp'].includes(attrField.datatype))
      return (
        <DatePicker
          showTime
          id={attrField.name}
          style={{ width: '100%' }}
          onChange={(value, dateString) =>
            handleAttrChange(
              convertDateTime(dateString, 'datetime'),
              attrField.name
            )
          }
        />
      )
    else if (attrField.datatype === 'date')
      return (
        <DatePicker
          id={attrField.name}
          style={{ width: '100%' }}
          onChange={(value, dateString) =>
            handleAttrChange(
              convertDateTime(dateString, 'date'),
              attrField.name
            )
          }
        />
      )
    else if (attrField.datatype === 'time')
      return (
        <TimePicker
          id={attrField.name}
          style={{ width: '100%' }}
          onChange={(value, timeString) =>
            handleAttrChange(
              convertDateTime(timeString, 'time'),
              attrField.name
            )
          }
        />
      )
    else return <>Datatype not yet supported</>
  }

  if (status === 'loading') {
    return (
      <Space
        direction="vertical"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '10vh',
          color: '#00a0df',
        }}
      >
        <FontAwesomeIcon
          style={{ minHeight: '5vh' }}
          icon={['fas', 'spinner']}
          spinPulse
        />
        <Title level={2}>{'Loading...'}</Title>
      </Space>
    )
  } else if (status === 'error') {
    return <Alert message="Form failed to generate" type="error" />
  }
  let gridDimension = Math.ceil(Math.sqrt(fieldData!.fields.length))
  return (
    <Form
      name="Multi-table Insert"
      layout="vertical"
      onFinish={handleSubmit}
      disabled={insertLoading}
    >
      <ResponsiveGridLayout
        className="formGrid"
        rowHeight={100}
        width={3000}
        isDraggable={false}
        isResizable={false}
      >
        {fieldData!.fields.map((field, i) => (
          <div
            key={field.name}
            data-grid={{ x: i % gridDimension, y: 0, w: 1, h: 1 }}
          >
            <Form.Item
              label={field.name}
              name={field.name}
              rules={[
                {
                  required: !field.default || field.default === 'null',
                },
              ]}
            >
              {generateFieldItem(field)}
            </Form.Item>
          </div>
        ))}
      </ResponsiveGridLayout>
      <Form.Item>
        <Button
          type="primary"
          size="large"
          shape="round"
          htmlType="submit"
          loading={insertLoading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default DynamicForm

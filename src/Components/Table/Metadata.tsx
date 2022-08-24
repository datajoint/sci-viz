import React from 'react'
import TableAttribute from './DataStorageClasses/TableAttribute'

import { Card, Descriptions } from 'antd'
interface MetadataProps {
  token: string
  route: string
  name: string
  height: number
  restrictionList: Array<string>
}

interface MetadataState {
  data: djRecords
  dataAttributes: djAttributes
}
//look at pharus/interface.py get_attributes() for payload
interface djAttributesArray {
  [index: number]: string
  type: string
  nullable: boolean
  default: string
  autoincriment: boolean
}
interface djAttributes {
  attributeHeaders: Array<string>
  attributes: {
    primary: Array<djAttributesArray>
    secondary: Array<djAttributesArray>
  }
}

interface djRecords {
  recordHeader: Array<string>
  records: Array<Array<number | null | bigint | boolean | string>>
  totalCount: number
}

/**
 * Metadata component
 */
export default class Metadata extends React.Component<
  MetadataProps,
  MetadataState
> {
  constructor(props: MetadataProps) {
    super(props)
    this.state = {
      data: { recordHeader: [], records: [[]], totalCount: 0 },
      dataAttributes: {
        attributeHeaders: [],
        attributes: { primary: [], secondary: [] },
      },
    }
    this.parseTimestr = this.parseTimestr.bind(this)
    this.getRecords = this.getRecords.bind(this)
    this.getAttributes = this.getAttributes.bind(this)
  }
  getRecords(): Promise<djRecords> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    if (this.props.restrictionList.length > 0) {
      apiUrl = apiUrl + '?'
      apiUrl = apiUrl + this.props.restrictionList.shift()
      while (this.props.restrictionList.length > 0) {
        apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
      }
    }
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

  getAttributes(): Promise<djAttributes> {
    let apiUrlAttr =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` +
      this.props.route +
      '/attributes'
    return fetch(apiUrlAttr, {
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
        return result as Promise<djAttributes>
      })
  }

  componentDidMount() {
    this.getRecords()
      .then((result) => {
        this.setState({ data: result })
      })
      .then(() => {
        return this.getAttributes()
      })
      .then((result) => {
        this.setState({ dataAttributes: result })
      })
      .then(() => this.parseTimestr())
  }

  parseTimestr() {
    let fullAttr = this.state.dataAttributes.attributes.primary.concat(
      this.state.dataAttributes.attributes.secondary
    )
    for (let i in fullAttr) {
      if (fullAttr[i][1] === 'HH:MM:SS') {
        let newData = this.state.data
        newData.records[0][i] = TableAttribute.parseTimeString(
          newData.records[0][i]!.toString()
        )
        this.setState({ data: newData })
      } else if (
        fullAttr[i][1] === 'timestamp' ||
        fullAttr[i][1].includes('datetime')
      ) {
        let newData = this.state.data
        newData.records[0][i] = TableAttribute.parseDateTime(
          newData.records[0][i]!.toString()
        )
        this.setState({ data: newData })
      } else if (fullAttr[i][1] === 'date') {
        let newData = this.state.data
        newData.records[0][i] = TableAttribute.parseDate(
          newData.records[0][i]!.toString()
        )
        this.setState({ data: newData })
      }
    }
  }
  render() {
    return (
      <Card
        style={{ width: '100%', height: this.props.height }}
        bodyStyle={{ height: '100%', overflowY: 'auto' }}
        hoverable={true}
      >
        <Descriptions
          bordered
          layout="horizontal"
          size="small"
          column={1}
          style={{ height: '100%' }}
        >
          {this.state.data.records[0].map((record: any, index: number) => {
            return (
              <Descriptions.Item label={this.state.data.recordHeader[index]}>
                {record}
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </Card>
    )
  }
}

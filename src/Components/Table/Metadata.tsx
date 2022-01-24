import React from 'react'
import TableAttribute from './DataStorageClasses/TableAttribute'
import './Metadata.css'
interface MetadataProps {
  token: string
  route: string
  name: string
  restrictionList: Array<string>
}

interface MetadataState {
  data: any
  attributes: any
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
      data: { recordHeader: [], records: [], totalCount: 0 },
      attributes: { primary: [], secondary: [] },
    }
    this.parseTimestr = this.parseTimestr.bind(this)
  }

  componentDidMount() {
    let apiUrl =
      `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route
    let apiUrlAttr =
      `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` +
      this.props.route +
      '/attributes'
    if (this.props.restrictionList.length > 0) {
      apiUrl = apiUrl + '?'
      apiUrl = apiUrl + this.props.restrictionList.shift()
      while (this.props.restrictionList.length > 0) {
        apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
      }
    }
    fetch(apiUrlAttr, {
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
        this.setState({
          attributes: {
            primary: result.attributes.primary,
            secondary: result.attributes.secondary,
          },
        })
      })
    fetch(apiUrl, {
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
        this.setState({
          data: {
            recordHeader: result.recordHeader,
            records: result.records[0],
            totalCount: result.totalCount,
          },
        })
      })
  }
  parseTimestr() {
    let fullAttr = this.state.attributes.primary.concat(
      this.state.attributes.secondary
    )
    for (let i in fullAttr) {
      if (fullAttr[i][1] === 'HH:MM:SS') {
        this.state.data.records[i] = TableAttribute.parseTimeString(
          this.state.data.records[i]
        )
      } else if (
        fullAttr[i][1] === 'timestamp' ||
        fullAttr[i][1].includes('datetime')
      ) {
        this.state.data.records[i] = TableAttribute.parseDateTime(
          this.state.data.records[i]
        )
      } else if (fullAttr[i][1] === 'date') {
        this.state.data.records[i] = TableAttribute.parseDate(
          this.state.data.records[i]
        )
      }
    }
  }
  render() {
    this.parseTimestr()
    return (
      <tbody className="metadata">
        {this.state.data.records.map((record: any, index: number) => {
          return (
            <tr>
              <td>{this.state.data.recordHeader[index]}</td>
              <td>{record}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }
}

import React from 'react'
import { Slider, Card } from 'antd'

interface DjSliderProps {
  /**JWT token for api call */
  token: string
  /**Route for api call */
  route: string
  /**List of strings to append to the api call for restricting query, comes from page query params */
  restrictionList: Array<string>
  /**key for page store */
  channel: string
  /**List of strings to append to the api call for restricting query, comes from other components */
  storeList?: Array<string>
  /**Determines whether the slider is vertical or horizontal */
  vertical?: boolean
  /**Determines whether the slider will also display what record is selected */
  showRecord?: boolean
  updatePageStore: (key: string, record: Array<string>) => void
}

interface DjSliderState {
  data: djRecords
  sliderValue: number
}

interface djRecords {
  recordHeader: Array<string>
  records: Array<Array<number | null | bigint | boolean | string>>
  totalCount: number
}

/**
 * DjSlider component
 */
export default class DjSlider extends React.Component<
  DjSliderProps,
  DjSliderState
> {
  constructor(props: DjSliderProps) {
    super(props)
    this.state = {
      data: { recordHeader: [], records: [[]], totalCount: 0 },
      sliderValue: 0,
    }
    this.getRecords = this.getRecords.bind(this)
    this.recordToQueryParams = this.recordToQueryParams.bind(this)
  }
  //Default props for slider component
  public static defaultProps = {
    vertical: false,
    showRecord: false,
  }

  getRecords(): Promise<djRecords> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    let queryParamList = [...this.props.restrictionList]
    if (this.props.storeList !== undefined) {
      queryParamList = queryParamList.concat(this.props.storeList)
    }
    apiUrl = apiUrl + '?' + queryParamList.join('&')
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
    this.getRecords().then((payload) => {
      this.setState({ data: payload })
    })
  }

  componentDidUpdate(prevProps: DjSliderProps): void {
    if (prevProps.restrictionList !== this.props.restrictionList) {
      this.getRecords().then((payload) => {
        this.setState({ data: payload })
      })
    }
  }

  recordToQueryParams(
    record: Array<number | null | bigint | boolean | string>,
    recordHeader: Array<string>
  ): Array<string> {
    let queryParams: Array<string> = []
    for (let i in recordHeader) {
      queryParams.push(recordHeader[i] + '=' + record[i])
    }
    return queryParams
  }

  displayRecord(displayRecord: boolean) {
    if (displayRecord) {
      return (
        <div>
          <tr>
            {this.state.data.recordHeader.map((value: string) => {
              return <th>{value}</th>
            })}
          </tr>
          <tr>
            {this.state.data.records[this.state.sliderValue].map(
              (value: number | null | bigint | boolean | string) => {
                return <td>{value}</td>
              }
            )}
          </tr>
        </div>
      )
    }
  }

  render() {
    return (
      <Card hoverable={true}>
        <Slider
          max={this.state.data.totalCount - 1}
          vertical={this.props.vertical}
          onChange={(value) => {
            this.props.updatePageStore(
              this.props.channel,
              this.recordToQueryParams(
                this.state.data.records[value],
                this.state.data.recordHeader
              )
            )
            this.setState({ sliderValue: value })
          }}
        />
        {this.displayRecord(this.props.showRecord!)}
      </Card>
    )
  }
}

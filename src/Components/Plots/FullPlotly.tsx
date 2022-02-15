import React from 'react'
import Plot from 'react-plotly.js'
import { Card } from 'antd'

interface RestrictionStore {
  [key: string]: Array<string>
}
interface FullPlotlyProps {
  route: string
  token: string
  restrictionList: Array<string>
  height: number | string
  channelList?: Array<string>
  store?: RestrictionStore
  needQueryParams?: boolean
}
interface PlotlyPayload {
  data: Array<{}>
  layout: {}
}
interface FullPlotlyState {
  plotlyJson: PlotlyPayload
}

/**
 * FullPlotly component
 */
export default class FullPlotly extends React.Component<
  FullPlotlyProps,
  FullPlotlyState
> {
  constructor(props: FullPlotlyProps) {
    super(props)
    this.state = {
      plotlyJson: { data: [], layout: {} },
    }
    this.updatePlot = this.updatePlot.bind(this)
  }
  public static defaultProps = {
    needQueryParams: true,
  }
  updatePlot(): Promise<PlotlyPayload> {
    let queryParamList = [...this.props.restrictionList]
    let channelCheckArr = Array<boolean>()

    // check to see if all the channels are populated
    for (let i in this.props.channelList) {
      console.log('i: ', i)
      console.log(this.props.store![this.props.channelList[+i]])
      console.log(typeof this.props.store![this.props.channelList[+i]])
      console.log(this.props.store![this.props.channelList[+i]] != undefined)
      if (this.props.store![this.props.channelList[+i]]) {
        channelCheckArr.push(true)
      } else {
        channelCheckArr.push(false)
      }

      console.log(channelCheckArr)
    }
    console.log('Store: ', this.props.store)
    console.log('channelCheckArr: ', channelCheckArr)
    console.log('needQueryParams: ', this.props.needQueryParams == true)
    console.log(this.props.restrictionList.includes(''))
    console.log(channelCheckArr.includes(false))
    console.log(
      this.props.needQueryParams == true &&
        this.props.restrictionList.includes('') &&
        channelCheckArr.includes(false)
    )
    // check if all the conditions are met to fetch the plot
    if (
      this.props.needQueryParams == true &&
      this.props.restrictionList.includes('') &&
      channelCheckArr.includes(false)
    ) {
      let arr = Array({})
      return Promise.resolve({ data: arr, layout: {} })
    }

    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route

    for (let i in this.props.channelList) {
      if (typeof this.props.store![this.props.channelList[+i]] != undefined) {
        queryParamList = queryParamList.concat(
          this.props.store![this.props.channelList[+i]]
        )
      }
    }
    console.log('queryParamList: ', queryParamList)
    apiUrl = apiUrl + '?' + queryParamList.join('&')
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((result) => result.json())
      .then((result) => {
        return result as PlotlyPayload
      })
  }
  componentDidMount() {
    this.updatePlot().then((payload) => {
      this.setState({
        plotlyJson: { data: payload.data, layout: payload.layout },
      })
    })
  }
  componentDidUpdate(
    prevProps: FullPlotlyProps,
    prevState: FullPlotlyState
  ): void {
    if (prevProps.restrictionList !== this.props.restrictionList) {
      this.updatePlot().then((payload) => {
        this.setState({
          plotlyJson: { data: payload.data, layout: payload.layout },
        })
      })
    }
  }

  render() {
    return (
      <Card
        style={{
          height: this.props.height,
        }}
        bodyStyle={{ overflow: 'auto', height: '100%' }}
        hoverable={true}
      >
        <Plot
          data={this.state.plotlyJson.data}
          layout={this.state.plotlyJson.layout}
        />
      </Card>
    )
  }
}

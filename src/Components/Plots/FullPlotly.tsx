import React from 'react'
import Plot from 'react-plotly.js'
import { Card } from 'antd'

interface FullPlotlyProps {
  route: string
  token: string
  restrictionList: Array<string>
  height: number | string
  storeList?: Array<string>
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
    if (
      this.props.needQueryParams == true &&
      this.props.restrictionList.includes('') &&
      this.props.storeList?.length == 0
    ) {
      let arr = Array({})
      return Promise.resolve({ data: arr, layout: {} })
    }
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    if (typeof this.props.storeList != undefined) {
      queryParamList = queryParamList.concat(this.props.storeList!)
    }
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
    if (
      this.props.needQueryParams &&
      this.props.restrictionList != [''] &&
      this.props.storeList != []
    ) {
      this.updatePlot().then((payload) => {
        this.setState({
          plotlyJson: { data: payload.data, layout: payload.layout },
        })
      })
    }
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

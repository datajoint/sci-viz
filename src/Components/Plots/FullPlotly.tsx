import React from 'react'
import Plot from 'react-plotly.js'

interface FullPlotlyProps {
  route: string
  token: string
  restrictionList: Array<string>
  storeList?: Array<string>
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
  updatePlot(): Promise<PlotlyPayload> {
    let apiUrl =
      `${process.env.REACT_APP_DJSCIVIZ_BACKEND_PREFIX}` + this.props.route
    let queryParamList = [...this.props.restrictionList]
    if (typeof this.props.storeList != undefined) {
      queryParamList = queryParamList.concat(this.props.storeList!)
    }
    console.log('query params list: ', queryParamList)
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
    this.forceUpdate()
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
      <div key={this.props.restrictionList.toString()}>
        <Plot
          data={this.state.plotlyJson.data}
          layout={this.state.plotlyJson.layout}
        />
      </div>
    )
  }
}

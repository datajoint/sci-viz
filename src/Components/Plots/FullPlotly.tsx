import React from 'react'
import Plot from 'react-plotly.js'

interface FullPlotlyProps {
  route: string
  token: string
  restrictionList: Array<string>
}

interface FullPlotlyState {
  plotlyJson: any
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
  updatePlot() {
    let apiUrl =
      `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route
    let resListCopy = [...this.props.restrictionList]
    if (resListCopy.length > 0) {
      apiUrl = apiUrl + '?'
      apiUrl = apiUrl + resListCopy.shift()
      while (resListCopy.length > 0) {
        apiUrl = apiUrl + '&' + resListCopy.shift()
      }
    }
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
          plotlyJson: { data: result.data, layout: result.layout },
        })
      })
  }
  componentDidMount() {
    this.updatePlot()
    this.forceUpdate()
  }
  componentDidUpdate(
    prevProps: FullPlotlyProps,
    prevState: FullPlotlyState
  ): void {
    if (prevProps.restrictionList !== this.props.restrictionList) {
      this.updatePlot()
    }
  }

  render() {
    return (
      <div key={this.props.restrictionList.toString()}>
        {console.log(this.props.restrictionList)}
        <Plot
          data={this.state.plotlyJson.data}
          layout={this.state.plotlyJson.layout}
        />
      </div>
    )
  }
}

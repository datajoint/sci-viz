import React from 'react';
import Plot from 'react-plotly.js';

interface FullPlotlyProps {
  route: string ;
  token: string ;
}

interface FullPlotlyState {
  plotlyJson: any ;
}


/**
 * FullPlotly component
 */
export default class FullPlotly extends React.Component<FullPlotlyProps, FullPlotlyState> {  
  constructor(props: FullPlotlyProps) {
    super(props);
    this.state = {
      plotlyJson: {data: [], layout: {}}
    }
    console.log(this.state.plotlyJson)
  }

  componentDidMount(){
    let apiUrl = `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route;
    fetch(apiUrl, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.props.token},
    })
    .then(result => {
      return result.json()}).then(result => {
        this.setState({plotlyJson: {data: result.data, layout: result.layout}})
    });
    // this.setState({plotlyJson: {data: testdata.data, layout: testdata.layout}})
    }

  render() {
    return (
      <div>
        <Plot data={this.state.plotlyJson.data} layout={this.state.plotlyJson.layout}/>
      </div>
    );
    }
  }
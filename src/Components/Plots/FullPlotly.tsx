import React from 'react';
import Plot from 'react-plotly.js';

interface FullPlotlyProps {
  route: string ;
  token: string ;
  restrictionList: Array<string>;
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
  }

  componentDidMount(){
    let apiUrl = `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route;
    if (this.props.restrictionList.length > 0){
      apiUrl = apiUrl + '?';
      apiUrl = apiUrl + this.props.restrictionList.shift()
      while (this.props.restrictionList.length > 0){
        apiUrl = apiUrl + '&' + this.props.restrictionList.shift()
      }
    }
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
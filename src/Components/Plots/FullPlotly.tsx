import React from 'react';
import Plot from 'react-plotly.js';

interface FullPlotlyProps {
  route: string ;
  token: string ;
}

interface FullPlotlyState {
  plotlyJson: object ;
}


/**
 * FullPlotly component
 */
export default class FullPlotly extends React.Component<FullPlotlyProps, FullPlotlyState> {  
  constructor(props: FullPlotlyProps) {
    super(props);
    this.state = {
      plotlyJson: {}
    }
  }

  getData(){
    let apiUrl = `${process.env.REACT_APP_DJLABBOOK_BACKEND_PREFIX}` + this.props.route;
    fetch(apiUrl, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.props.token},
    })
    .then(result => {
       this.setState({plotlyJson: result.json()});
    })
  }

  render() {
    return (
      <div>
      </div>
    );
    }
  }
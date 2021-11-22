import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TableView from './Table/TableView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {solarizedlight} from 'react-syntax-highlighter/dist/esm/styles/prism'
import FullPlotly from './Plots/FullPlotly'
import Metadata from './Table/Metadata'

interface DynamicGridProps {
  route: string ;
  token: string ;
  columns: number;
  rowHeight: number;
  componentList: []
  routeList: [];
}

interface DynamicGridState {
}

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DynamicGrid component
 */
export default class DynamicGrid extends React.Component<DynamicGridProps, DynamicGridState> {  
  constructor(props: DynamicGridProps) {
    super(props);
    this.state = {
    }
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
    }

  render() {
    return (
      <ResponsiveGridLayout className="mygrid" 
      rowHeight={this.props.rowHeight}
      measureBeforeMount={false}
      breakpoints={{lg: 1200, sm: 768}}
      cols={{lg: this.props.rowHeight, sm: 1}}
      useCSSTransforms={true}>

      </ResponsiveGridLayout>
    );
    }
  }

import React from 'react';
import './App.css';
import Login from './Components/Login/Login';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import NotFound from './Components/Errors/NotFound'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

import Home from './Components/Pages/Home' 
import Markdown from './Components/Pages/Markdown' 
import Table from './Components/Pages/Table' 
import Plots from './Components/Pages/Plots' 
import Metadata from './Components/Pages/Metadata' 
import Dynamic_Grid from './Components/Pages/Dynamic_Grid' 
import Dynamic_Form from './Components/Pages/Dynamic_Form' 
import Hidden_Page from './Components/Pages/Hidden_Page' 

window.onbeforeunload = () => '';

interface DJGUIAppProps {
}

interface DJGUIAppState {
  jwtToken: string; // Storage object for JWT token obtain after logging in successfully
  hostname: string; // Name of the database that the user is connected to
}

/**
 * React top level component for the GUI
 */
export default class App extends React.Component<DJGUIAppProps, DJGUIAppState> {
  constructor(props: DJGUIAppProps) {
    super(props);
    this.state = {
      jwtToken: '',
      hostname: ''
    };

    this.setJWTTokenAndHostName = this.setJWTTokenAndHostName.bind(this);
    this.getBasename = this.getBasename.bind(this)
  }

  /**
   * Setter function for jwt token and host name
   * @param jwt JWT token obtain after logging sucessfully from the backend
   * @param hostname Hostname of the database that is being connected to
   */
  setJWTTokenAndHostName(jwt: string, hostname: string) {
    this.setState({jwtToken: jwt, hostname: hostname});
  }
  getBasename(){
    if (window.location.href.split('/').length == 4){
      return ''
    }
    else {
      let arr = window.location.href.split('/').splice(3)
      arr.pop() // pop the empty string
      return ('/' + arr.join('/'))
    }
  }

  render() {
    return (
      <div>
        <Header text='Powered by datajoint' imageRoute={require('./logo.svg')['default']}/>
        <Router basename={this.getBasename()}>
          <div className='content'>
            <Switch>
              <Route exact path='/'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Redirect to='/login'/>}</Route>
              <Route path='/login'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Login setJWTTokenAndHostName={this.setJWTTokenAndHostName} defaultAddress='localdb' imageRoute={require("./logo.svg")["default"]}></Login>}</Route>
              <Route path='/home*'>{this.state.jwtToken !== '' ? <Home jwtToken={this.state.jwtToken}></Home> : <Redirect to='/login'/>}</Route>
              <Route path='/mkdown*'>{this.state.jwtToken !== '' ? <Markdown jwtToken={this.state.jwtToken}></Markdown> : <Redirect to='/login'/>}</Route>
              <Route path='/tableExample*'>{this.state.jwtToken !== '' ? <Table jwtToken={this.state.jwtToken}></Table> : <Redirect to='/login'/>}</Route>
              <Route path='/plots*'>{this.state.jwtToken !== '' ? <Plots jwtToken={this.state.jwtToken}></Plots> : <Redirect to='/login'/>}</Route>
              <Route path='/metadata*'>{this.state.jwtToken !== '' ? <Metadata jwtToken={this.state.jwtToken}></Metadata> : <Redirect to='/login'/>}</Route>
              <Route path='/dynamicGrid*'>{this.state.jwtToken !== '' ? <Dynamic_Grid jwtToken={this.state.jwtToken}></Dynamic_Grid> : <Redirect to='/login'/>}</Route>
              <Route path='/dynamicForm*'>{this.state.jwtToken !== '' ? <Dynamic_Form jwtToken={this.state.jwtToken}></Dynamic_Form> : <Redirect to='/login'/>}</Route>
              <Route path='/hiddenpage*'>{this.state.jwtToken !== '' ? <Hidden_Page jwtToken={this.state.jwtToken}></Hidden_Page> : <Redirect to='/login'/>}</Route>
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </Router>
        <Footer/>
      </div>
    );
  }
}

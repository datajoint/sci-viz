import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import Home from './Components/home';

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
  }

  /**
   * Setter function for jwt token and host name
   * @param jwt JWT token obtain after logging sucessfully from the backend
   * @param hostname Hostname of the database that is being connected to
   */
  setJWTTokenAndHostName(jwt: string, hostname: string) {
    this.setState({jwtToken: jwt, hostname: hostname});
  }

  render() {
    return (
      <Router>
        <div className='content'>
          <Switch>
            <Route exact path='/'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Redirect to='/login'/>}</Route>
            <Route path='/login'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Login setJWTTokenAndHostName={this.setJWTTokenAndHostName}></Login>}</Route>
            <Route path='/home'>{this.state.jwtToken !== '' ? <Home jwtToken={this.state.jwtToken}></Home> : <Redirect to='/login'/>}</Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
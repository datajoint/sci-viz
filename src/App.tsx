
import React from 'react';
import './App.css';
import Login from './Components/Login/Login';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import Home from './Components/home';
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import NotFound from './Components/Errors/NotFound' 
import Page1 from './Components/Pages/Page1' 
import Page2 from './Components/Pages/Page2' 

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
      <div>
        <Header></Header>
        <Router>
          <div className='content'>
            <Switch>
              <Route exact path='/'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Redirect to='/login'/>}</Route>
              <Route path='/login'>{this.state.jwtToken !== '' ? <Redirect to='/home'/> : <Login setJWTTokenAndHostName={this.setJWTTokenAndHostName}></Login>}</Route>
              <Route path='/home'>{this.state.jwtToken !== '' ? <Home jwtToken={this.state.jwtToken}></Home> : <Redirect to='/login'/>}</Route>
              <Route path='/session1'>{this.state.jwtToken !== '' ? <Page1 jwtToken={this.state.jwtToken}></Page1> : <Redirect to='/login'/>}</Route>
              <Route path='/session2'>{this.state.jwtToken !== '' ? <Page2 jwtToken={this.state.jwtToken}></Page2> : <Redirect to='/login'/>}</Route>
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </Router>
        <Footer></Footer>
      </div>
    );
  }
}

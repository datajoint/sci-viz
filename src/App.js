import React, { Component } from 'react';
import './App.css';
import Table from './Components/Table';
import Login from './Components/Login/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1><Table/></h1>
        <h2><Login/></h2>
      </header>
    </div>
  );
}

export default App;


import './App.css';
import React, { useState, useEffect } from 'react';

import Home from './Home';
import InitialPage from './Create';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
        <div className="content">
        <Switch>
          <Route exact path="/">
         <InitialPage />
         </Route>
         <Route  path="/home/:roomid/:username">
         <Home />
         </Route>
         </Switch>
         </div>
    </div>
    </Router>
  );
}

export default App;

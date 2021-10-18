import { useState } from 'react';
import './App.css';
import Home from './mycomp/Home'
import Lobby from './mycomp/Lobby'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

function App() {
  return (
    <Router>
    <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/lobby/:username">
            <Lobby />
          </Route>
    </Switch>
    </Router>
  );
}

export default App;

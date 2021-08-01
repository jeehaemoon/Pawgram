import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import Homepage from "./Homepage";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import SignUp from "./SignUp";

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

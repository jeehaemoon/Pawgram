import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pets from "../components/Pets";
import Homepage from "./Homepage";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import Form from "./Pets/Form";

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/pets">
          <Pets />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <LogIn />
        </Route>
        <Route exact path="/add-pet">
          <Form />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

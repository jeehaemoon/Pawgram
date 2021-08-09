import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Pets from "../components/Pets";
import Homepage from "./Homepage";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import Form from "./Pets/Form";
import PetInfo from "./Pets/PetInfo";
import Album from "../components/Album";
import PictureForm from "./Album/PictureForm";
import Picture from "./Album/Picture";
import Friends from "../components/Friends";
import Friend from "./Friends/Friend";
import Footer from "./Footer";
import Messages from "../components/Messages";
import MessageForm from "./Messages/MessageForm";

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
        <Route exact path="/pets/:_id">
          <PetInfo />
        </Route>
        <Route exact path="/album">
          <Album />
        </Route>
        <Route exact path="/add-picture">
          <PictureForm />
        </Route>
        <Route exact path="/pictures/:_id">
          <Picture />
        </Route>
        <Route exact path="/friends/">
          <Friends />
        </Route>
        <Route exact path="/friends/:_id">
          <Friend />
        </Route>
        <Route exact path="/messages">
          <Messages />
        </Route>
        <Route exact path="/send-message/:_id">
          <MessageForm />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;

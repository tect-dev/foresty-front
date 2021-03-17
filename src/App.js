import { HomePage } from "./pages/Home.tsx";
import { TreePage } from "./pages/Tree";
import { ForestPage } from "./pages/Forest";
import { LoginPage } from "./pages/Login";
import { GlobalWrapper } from "./wrapper/GlobalWrapper";

import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { authService } from "./lib/firebase";
import { reduxStore } from "./index";
import { useSelector } from "react-redux";
import { authCheck } from "./redux/user";

const customHistory = createBrowserHistory();

authService.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    reduxStore.dispatch(authCheck(user));
  } else {
    // No user is signed in.
  }
});

function App() {
  const { myID } = useSelector((state) => {
    return { myID: state.user.myID };
  });
  return (
    <Router history={customHistory}>
      <GlobalWrapper>
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/login" exact={true} component={LoginPage} />
          <Route path="/forest/:userID" component={ForestPage} />
          <Route path="/tree/:treeID" component={TreePage} />
        </Switch>
      </GlobalWrapper>
    </Router>
  );
}

export default App;

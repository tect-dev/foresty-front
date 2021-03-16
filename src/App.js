import { HomePage } from "./pages/Home.tsx";
import { TreePage } from "./pages/Tree";
import { GlobalWrapper } from "./wrapper/GlobalWrapper";

import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const customHistory = createBrowserHistory();

function App() {
  return (
    <Router history={customHistory}>
      <GlobalWrapper>
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/tree/:treeID" component={TreePage} />
        </Switch>
      </GlobalWrapper>
    </Router>
  );
}

export default App;

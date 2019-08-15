import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider, Subscribe } from "unstated";
import AuthContainer from "./containers/AuthContainer";
import ProjectContainer from "./containers/ProjectContainer";

ReactDOM.render(
  <Provider>
    <Subscribe to={[AuthContainer, ProjectContainer]}>
      {(authCon, projectCon) => <App authCon={authCon} projectCon={projectCon} />}
      
    </Subscribe>
  </Provider>,
  document.getElementById("root")
);

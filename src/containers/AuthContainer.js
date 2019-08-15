import { Container } from "unstated";

export default class AuthContainer extends Container {
  state = {
    id: "",
    email: "",
    username: "",
    projects: {},
  };

  setAuth = newAuth => this.setState(newAuth);

  signOut = async () => {
    await this.setState({
      id: "",
      email: "",
      username: "",
      projects: {},
      path: [],
    });
  };
}

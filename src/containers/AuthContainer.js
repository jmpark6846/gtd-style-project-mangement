import { Container } from "unstated";

export default class AuthContainer extends Container {
  state = {
    id: "",
    email: "",
    username: "",
    projects: {}
  };

  setAuth = auth => this.setState(auth);

  signOut = async () => {
    await this.setState({
      id: "",
      email: "",
      username: ""
    });
  };
}

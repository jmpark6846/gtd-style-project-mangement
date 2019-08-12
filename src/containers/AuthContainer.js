import { Container } from 'unstated'

export default class AuthContainer extends Container{
  state = { 
    id: "",
    email: "",
    username: "",
  }

  setAuth(user) {
    this.setState({
      id: user.id,
      email: user.email,
      username: user.username,
    })
  }
}

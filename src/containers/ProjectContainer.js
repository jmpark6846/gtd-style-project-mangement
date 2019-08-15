import { Container } from 'unstated'

export default class ProjectContainer extends Container{
  state = {
    projects: {},
    lists: {},
    todos: {},
  }

  update = newState => this.setState(newState)
  
}
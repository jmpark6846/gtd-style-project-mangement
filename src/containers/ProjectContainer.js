import { Container } from 'unstated'

export default class ProjectContainer extends Container{
  state = {
    projects: {},
    isLoading:true,
  }

  update = newState => this.setState(newState)
  
}
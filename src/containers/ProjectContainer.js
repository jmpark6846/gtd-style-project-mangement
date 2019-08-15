import { Container } from 'unstated'

export default class ProjectContainer extends Container{
  state = {
    projects: {},
    lists:{},
    todos:{},
    isLoading:true,
  }

  update = newState => this.setState(newState)
  addTodo = (listId, todo) => {
    this.setState({
      todos: {
        ...this.state.todos,
        [listId]: {
          ...this.state.todos[listId],
          [todo.id]: todo
        }
      }
    })
  }
}
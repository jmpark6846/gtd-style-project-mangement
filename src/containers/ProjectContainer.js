import { Container } from 'unstated';

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

  updateTodo = (todoId, listId, updatedTodoAttrs) => {
    this.setState({
      todos: {
        ...this.state.todos,
        [listId]: {
          ...this.state.todos[listId],
          [todoId]: {
            ...this.state.todos[listId][todoId],
            ...updatedTodoAttrs
          }
        }
      }
    })
  }
  
  deleteTodo = (todoId, listId) => {
    const listTodos = { ...this.state.todos[listId] };
    delete listTodos[todoId];

    this.setState({
      todos: {
        ...this.state.todos,
        [listId]: listTodos
      }
    });
  }
}
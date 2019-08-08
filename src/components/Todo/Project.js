import React, { Component } from 'react'
import List from './List';
import { Button } from '../common';


export default class Project extends Component {
  state = { 
    heading: "",
    description: "",
    
    
  }

  _handleAddList = () => {
    
  }

  render() {
    return (
      <div>
        <div>
          <Button>새 리스트 추가</Button>
        </div>

        <List />
      </div>
    )
  }
}

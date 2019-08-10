import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from '../common';

const SlidePane = styled.div`


`

class Slide extends React.Component {
  render() {
    
    return (
      <SlidePane>
        {this.props.children}
      </SlidePane>
    )  
  }
  
}

Slide.propTypes = {

}

export default Slide


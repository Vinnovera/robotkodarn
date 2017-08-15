import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// TODO: Decide what to do with rule 'react/prefer-stateless-function'
/* eslint-disable react/prefer-stateless-function */
export class App extends Component {
  // FIXME: Is constructor needed? Else, remove?
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>{ this.props.children }</div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object
}

export default connect()(App)

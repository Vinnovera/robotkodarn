import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './../Header'
import styles from './view.css'

class View extends Component {
  componentWillReceiveProps() {
    console.log('Nu kommer nya!')
  }

  render() {
    return (
      <div className={styles.View}>
        <Header />
        { this.props.children }
      </div>
    )
  }
}

export default connect()(View)

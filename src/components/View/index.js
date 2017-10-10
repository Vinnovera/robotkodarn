import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from './../Navbar'
import styles from './view.css'

class View extends Component {
  render() {
    return (
      <div className={styles.View}>
        <Navbar />
        { this.props.children }
      </div>
    )
  }
}

export default connect()(View)

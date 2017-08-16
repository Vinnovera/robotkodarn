import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './navbar.css'

class WorkshopPincode extends Component {
  render() {
    return (
      <p className={styles.workshopPinCode}>
        {this.props.pincode}
      </p>
    )
  }
}

function mapStateToProps(state) {
  return {
    pincode: JSON
      .parse(state.login.currentWorkshop)
      .pincode
  }
}

export default connect(mapStateToProps)(WorkshopPincode)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import WorkshopPincode from './WorkshopPincode'
import styles from './navbar.css'

class Navbar extends Component {
  constructor(props) {
    super(props)

    this.goToLogin = this
      .goToLogin
      .bind(this)
  }

  goToLogin() {
    this
      .props
      .dispatch(routeActions.push('/login'))
  }

  render() {
    return (
      <nav className={styles.mainNavbar}>
        {/* FIXME: No static element interactions */}
        <div onClick={this.goToLogin} className={styles.logoRobot} />
        <h3 className={styles.logo}>Robotkodarn</h3>
        <WorkshopPincode pincode={this.props.pincode} />
      </nav>
    )
  }
}

export default connect()(Navbar)

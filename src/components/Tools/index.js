import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { toggleTools } from '../../actions/tools'
import { signOut } from '../../actions/authentication'
import styles from './tools.css'

import Button from './../Button'

class Tools extends Component {
  signout = () => {
    this.props.dispatch(toggleTools())
    this.props.dispatch(signOut('/admin'))
  }

  toggleTools = () => {
    this.props.dispatch(toggleTools())
  }

  /**
   * Use event.target.value to navigate between views
   */
  changeView = (event) => {
    this.props.dispatch(routeActions.push(event.target.value))
  }

  render() {
    const navigationStyles = this.props.tools ? styles.navigationOpen : styles.navigation

    return (
      <nav className={navigationStyles}>
        <button onClick={this.toggleTools} className={styles.exit} >Stäng</button>
        <ul>
          <li><button onClick={this.changeView} className={styles.navigationButton} value="adminpage">Växla till elev-vy</button></li>
          <li><button onClick={this.changeView} className={styles.navigationButton} value="adminpage">Skapa workshops</button></li>
          {this.props.role === 'superadmin' ?
            <li><button onClick={this.changeView} className={styles.navigationButton} value="invite">Bjud in nya användare</button></li>
            :
            ''
          }
        </ul>
        <div className={styles.buttonWrapper}>
          <Button handleClick={this.signout}>Logga ut</Button>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.loggedInUser,
    tools: state.tools.open
  }
}

export default connect(mapStateToProps)(Tools)

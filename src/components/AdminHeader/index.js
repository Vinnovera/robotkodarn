import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { signOut } from '../../actions/authentication'
import Logo from '../Logo'
import styles from './adminheader.css'


class AdminHeader extends Component {
  signout = () => {
    this.props.dispatch(signOut('/admin'))
  }

  /**
   * Use event.target.value to navigate between views
   */
  changeView = (event) => {
    this.props.dispatch(routeActions.push(event.target.value))
  }

  render() {
    const navigation = this.props.role === 'superadmin' ?
      (<ul>
        <li><button onClick={this.changeView} className={styles.navigationButton} value="adminpage">Skapa workshops</button></li>
        <li><button onClick={this.changeView} className={styles.navigationButton} value="invite">Bjud in nya användare</button></li>
        <li><button onClick={this.signout} className={styles.navigationButton}>Logga ut</button></li>
      </ul>)
      :
      (<ul>
        <li><button onClick={this.signout} className={styles.navigationButton}>Logga ut</button></li>
      </ul>)

    return (
      <header className={styles.header}>
        <div className={styles.logo}><Logo /></div>
        {this.props.message ? <h5>{this.props.message}</h5> : ''}
        <nav className={styles.navigation}>{navigation}</nav>
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.adminpage.message,
    role: state.user.loggedInUser
  }
}

export default connect(mapStateToProps)(AdminHeader)

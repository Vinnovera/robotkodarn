import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { Link } from 'react-router'
import { toggleTools } from '../../actions/tools'
import { signOut } from '../../actions/authentication'
import { toggleEditing } from '../../actions/editor'
import styles from './menu.css'

import Button from './../Button'

class Menu extends Component {
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

  startEditing = () => {
    this.props.dispatch(toggleTools())
    this.props.dispatch(toggleEditing())
  }

  render() {
    const navigationStyles = this.props.tools ? styles.navigationOpen : styles.navigation

    return (
      <nav className={navigationStyles}>
        <button onClick={this.toggleTools} className={styles.exit} >Stäng</button>
        <div className={styles.userInfo}>
          <p className={styles.userName}>Inloggad som: {this.props.name}</p>
          <p className={styles.userRole}>Roll: {this.props.role}</p>
        </div>
        { this.props.currentWorkshop ?
          <Link className={styles.navigationLink} onClick={this.startEditing}>{ this.props.editing ? `Sluta redigera ${this.props.currentWorkshop.pincode}` : `Redigera ${this.props.currentWorkshop.pincode}`}</Link>
          :
          ''
        }
        <Link className={styles.navigationLink} to="/workshops" onClick={this.toggleTools}>Hantera workshops</Link>
        {this.props.role === 'superadmin' ?
          <Link className={styles.navigationLink} to="/invite" onClick={this.toggleTools}>Bjud in nya användare</Link>
          :
          ''
        }
        <div className={styles.buttonWrapper}>
          <Button handleClick={this.signout}>Logga ut</Button>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.role,
    name: state.user.name,
    tools: state.tools.open,
    currentPage: state.routeReducer.location.pathname,
    currentWorkshop: JSON.parse(state.login.currentWorkshop),
    editing: state.editor.editing
  }
}

export default connect(mapStateToProps)(Menu)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleMenu } from '../../actions/menu'
import { signOut } from '../../actions/authentication'
import { toggleEditing } from '../../actions/editor'
import styles from './menu.css'

import Button from './../Button'
import OutsideAlerter from './../OutsideAlerter'

class Menu extends Component {
  signout = () => {
    this.props.dispatch(toggleMenu())
    this.props.dispatch(signOut('/admin'))
  }

  handleMenu = () => {
    this.props.dispatch(toggleMenu())
  }

  startEditing = () => {
    this.props.dispatch(toggleMenu())
    this.props.dispatch(toggleEditing())
  }

  render() {
    const navigationStyles = this.props.menu ? styles.navigationOpen : styles.navigation

    return (
      <OutsideAlerter>
        <nav className={navigationStyles}>
          <button onClick={this.handleMenu} className={styles.exit} >Stäng</button>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Inloggad som: {this.props.name}</p>
            <p className={styles.userRole}>Roll: {this.props.role}</p>
          </div>
          { this.props.currentWorkshop ?
            <Link className={styles.navigationLink} onClick={this.startEditing}>{ this.props.editing ? `Sluta redigera ${this.props.currentWorkshop.pincode}` : `Redigera ${this.props.currentWorkshop.pincode}`}</Link>
            :
            ''
          }
          <Link className={styles.navigationLink} to="/workshops" onClick={this.handleMenu}>Mina workshops</Link>
          {this.props.role === 'superadmin' ?
            <Link className={styles.navigationLink} to="/invite" onClick={this.handleMenu}>Bjud in nya användare</Link>
            :
            ''
          }
          <div className={styles.buttonWrapper}>
            <Button handleClick={this.signout}>Logga ut</Button>
          </div>
        </nav>
      </OutsideAlerter>
    )
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.role,
    name: state.user.name,
    menu: state.menu.open,
    currentWorkshop: state.currentWorkshop.item,
    editing: state.editor.editing
  }
}

export default connect(mapStateToProps)(Menu)

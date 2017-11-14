import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleMenu } from '../../actions/menu'
import styles from './navbar.css'
import Menu from '../Menu/'

class Header extends Component {
  handleMenu = () => {
    this.props.dispatch(toggleMenu())
  }

  render() {
    return (this.props.isLoggedIn) ? (
      <div className={styles.toolsIconWrapper}>
        <button onClick={this.handleMenu} className={styles.toolsIcon} >Verktyg</button>
        <Menu />
      </div>
    ) : ''
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.isLoggedIn
  }
}

export default connect(mapStateToProps)(Header)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleTools } from '../../actions/tools'
import styles from './header.css'
import Menu from '../Menu/'

class Header extends Component {
  toggleTools = () => {
    this.props.dispatch(toggleTools())
  }

  render() {
    return (
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Robotkodarn</h1>
        <button onClick={this.toggleTools} className={styles.toolsIcon} >Verktyg</button>
        <Menu />
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    role: state.user.isLoggedIn
  }
}

export default connect(mapStateToProps)(Header)

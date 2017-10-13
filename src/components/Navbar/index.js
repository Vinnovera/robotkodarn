import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleMenu } from '../../actions/menu'
import styles from './header.css'
import Menu from '../Menu/'

class Header extends Component {
  handleMenu = () => {
    this.props.dispatch(toggleMenu())
  }

  render() {
    return (
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Robotkodarn</h1>
        { this.props.isLoggedIn ?
          <div>
            <button onClick={this.handleMenu} className={styles.toolsIcon} >Verktyg</button>
            <Menu />
          </div>
          :
          ''
        }
      </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.isLoggedIn
  }
}

export default connect(mapStateToProps)(Header)

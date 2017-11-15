import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleMenu } from '../../actions/menu'
import styles from './toolsbutton.css'
import Menu from './../Menu'

class ToolsButton extends Component {
  handleMenu = () => {
    this.props.dispatch(toggleMenu())
  }

  render() {
    return (
      <div>
        <div className={styles.toolsIconWrapper}>
          <button onClick={this.handleMenu} className={styles.toolsIcon}>Verktyg</button>
        </div>
        <Menu />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.isLoggedIn
  }
}

export default connect(mapStateToProps)(ToolsButton)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { toggleSidebar } from '../../actions/student'
import SidebarList from './../SidebarList'
import styles from './sidebar.css'

class Sidebar extends Component {
  getSidebarClassName = () => {
    if (this.props.isSidebarOpen) {
      return styles.sidebar
    }

    return `${styles.sidebar} ${styles.sidebarClosed}`
  }

  getCloseBtnClassName = () => {
    if (!this.props.isSidebarOpen) {
      return styles.rotated
    }
  }

  handleSidebarClick = () => {
    this.props.dispatch(toggleSidebar(!this.props.isSidebarOpen))
  }

  render() {
    return (
      <aside className={this.getSidebarClassName()}>
        <section>
          <p className={styles.pinCode}>{this.props.workshop.pincode}</p>
          <h2 className={styles.sidebarTitle}>{this.props.workshop.title}</h2>
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Delmoment</h3>
          <SidebarList type="parts" />
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Referenslänkar</h3>
          <SidebarList type="reference" />
        </section>
        <button className={styles.toggleSidebarButton} onClick={this.handleSidebarClick}>
          <FA className={this.getCloseBtnClassName()} name="angle-double-left" />
        </button>
      </aside>
    )
  }
}

function mapStateToProps(state) {
  return {
    isSidebarOpen: state.sidebar.open,
    editing: state.editor.editing,
    workshop: JSON.parse(state.login.currentWorkshop)
  }
}

export default connect(mapStateToProps)(Sidebar)

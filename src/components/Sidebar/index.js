import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { toggleSidebar } from '../../actions/sidebar'

import PartList from './PartList'
import LinkList from './LinkList'
import StatusBar from './StatusBar'
import WorkshopTitle from './WorkshopTitle'

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

  // editTitle = (e) => {
  //   e.preventDefault()
  //   const type = e.currentTarget.value

  //   this.props.dispatch(setEditingType(type))
  // }

  render() {
    return (
      <aside className={this.getSidebarClassName()}>
        <h1>Robotkodarn</h1>
        <section>
          <p className={styles.pinCode}>{this.props.workshop.pincode}</p>
          <WorkshopTitle />
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Övningar</h3>
          {/* <SidebarList listType="parts" /> */}
          <PartList />
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Läs mer</h3>
          <LinkList />
        </section>
        <StatusBar />
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
    workshop: state.currentWorkshop.item,
    chromeAppReachable: state.statusBar.chromeAppReachable,
    deviceConnected: state.statusBar.deviceConnected
  }
}

export default connect(mapStateToProps)(Sidebar)

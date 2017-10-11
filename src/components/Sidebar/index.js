import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { toggleSidebar } from '../../actions/student'
import PartList from './PartList'
import ReferenceList from './ReferenceList'
import styles from './sidebar.css'

class Sidebar extends Component {
  getSidebarClassName = () => {
    if (this.props.isSidebarOpen) {
      return styles.mainSidebar
    }

    return `${styles.mainSidebar} ${styles.mainSidebarClosed}`
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
      <div className={this.getSidebarClassName()}>
        <div className={styles.content}>
          <p className={styles.pinCode}>{this.props.workshop.pincode}</p>
          <h2 className={styles.sidebarTitle}>{this.props.workshop.title}</h2>
          <div className={styles.wave} />
          <PartList parts={this.props.workshop.parts} />
          <hr />
          <h2>Referenslänkar</h2>
          <ReferenceList links={this.props.workshop.links} />
        </div>
        <button className={styles.toggleSidebarButton} onClick={this.handleSidebarClick}>
          <FA className={this.getCloseBtnClassName()} name="angle-double-left" />
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isSidebarOpen: state.sidebar.open,
    workshop: JSON.parse(state.login.currentWorkshop)
  }
}

export default connect(mapStateToProps)(Sidebar)

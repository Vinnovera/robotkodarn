import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { toggleSidebar } from '../../actions/student'

import PartList from './PartList'
import ReferenceList from './ReferenceList'
import styles from './sidebar.css'

class Sidebar extends Component {
  constructor() {
    super()
    this.handleSidebarClick = this
      .handleSidebarClick
      .bind(this)
    this.getSidebarClassName = this
      .getSidebarClassName
      .bind(this)
  }

  getSidebarClassName() {
    if (this.props.isSidebarOpen) {
      return styles.mainSidebar
    }

    return `${styles.mainSidebar} ${styles.mainSidebarClosed}`
  }

  getCloseBtnClassName() {
    if (!this.props.isSidebarOpen) {
      return styles.rotated
    }
  }

  handleSidebarClick() {
    this
      .props
      .dispatch(toggleSidebar(!this.props.isSidebarOpen))
  }


  render() {
    return (
      <div className={this.getSidebarClassName()}>
        <div className="content">
          <h2>{this.props.workshop.title}</h2>
          <PartList parts={this.props.workshop.parts} />
          <hr/>
          <h2>Referenslänkar</h2>
          <ReferenceList links={this.props.workshop.links} />
        </div>
        {/* TODO: Should this anchor not just be a button instead? See rule 'jsx-a11y/href-no-hash */}
        <a className={styles.closeBtn} href="#" onClick={this.handleSidebarClick}>
          <FA className={this.getCloseBtnClassName()} name='angle-double-left'/>
        </a>
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

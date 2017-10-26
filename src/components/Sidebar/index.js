import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { toggleSidebar } from '../../actions/sidebar'
import { setEditingType } from '../../actions/editor'
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

  editTitle = (event) => {
    event.preventDefault()
    const type = event.currentTarget.value
    this.props.dispatch(setEditingType(type))
  }

  render() {
    return (
      <aside className={this.getSidebarClassName()}>
        <section>
          <p className={styles.pinCode}>{this.props.workshop.pincode}</p>
          { this.props.editing ?
            <button onClick={this.editTitle} className={styles.sidebarTitleButton} value="title">
              <FA className={styles.addIcon} name="pencil" />
              <h2 className={styles.sidebarTitleEdit}>
                {this.props.workshop.title}
              </h2>
            </button>
            :
            <h2 className={styles.sidebarTitle}>{this.props.workshop.title}</h2>
          }
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Övningar</h3>
          <SidebarList listType="parts" />
        </section>
        <section className={styles.section}>
          <div className={styles.wave} />
          <h3 className={styles.sidebarSub}>Hur funkar det?</h3>
          <SidebarList listType="reference" />
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
    workshop: state.currentWorkshop.item
  }
}

export default connect(mapStateToProps)(Sidebar)

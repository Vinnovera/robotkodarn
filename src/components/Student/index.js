import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { findWorkshopByPin } from '../../actions/workshops'
import { setCurrentParts } from '../../actions/student'

import Navbar from './../Navbar'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import Console from './../Console'
import ActionButtons from './../ActionButtons'

import styles from './student.css'

export class Student extends Component {
  constructor(props) {
    super(props)

    this.getMainPaneClassName = this
      .getMainPaneClassName
      .bind(this)

    this.state = {
      workshop: null
    }
  }
  componentWillMount() {
    this.props.dispatch(findWorkshopByPin(this.props.params.pin))

    if (this.props.currentWorkshop) {
      this.setState({
        workshop: JSON.parse(this.props.currentWorkshop)
      }, () => {
        const currentParts = JSON.parse(this.props.currentWorkshop).parts
        this.props.dispatch(setCurrentParts(currentParts))
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentWorkshop !== nextProps.currentWorkshop) {
      this.setState({
        workshop: JSON.parse(nextProps.currentWorkshop)
      }, () => {
        const currentParts = JSON
          .parse(nextProps.currentWorkshop)
          .parts
        this
          .props
          .dispatch(setCurrentParts(currentParts))
      })
    }
  }

  getMainPaneClassName() {
    if (this.props.isSidebarOpen) {
      return styles.mainPane
    }

    return `${styles.mainPane} ${styles.mainPaneExpanded}`
  }

  renderWorkshop() {
    if (this.state.workshop) {
      return (
        <div>
          <Navbar />
          <Sidebar />
          <div className={this.getMainPaneClassName()}>
            <h2>{this.state.workshop.parts[this.props.activePartIndex].title}</h2>
            <ActionButtons />
            <Editor />
            <Console />
          </div>
        </div>
      )
    }

    return (
      <i className={styles.spinner} />
    )
  }

  render() {
    return this.renderWorkshop()
  }
}

function mapStateToProps(state) {
  return {
    isSidebarOpen: state.sidebar.open,
    currentWorkshop: state.login.currentWorkshop,
    activePartIndex: state.editor.activePartIndex
  }
}

export default connect(mapStateToProps)(Student)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findWorkshopByPin, clearWorkshop } from '../../actions/workshops'
import { setCurrentParts } from '../../actions/student'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import EditorForm from './../EditorForm'
import Console from './../Console'
import ActionButtons from './../ActionButtons'
import View from './../View'
import styles from './student.css'

export class Student extends Component {
  constructor(props) {
    super(props)
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
    // When leaving editor view, make sure to update local state with currentWorkshop
    if (this.props.editing === true && nextProps.editing === false) {
      if (this.props.currentWorkshop) {
        this.setState({
          workshop: JSON.parse(this.props.currentWorkshop)
        }, () => {
          const currentParts = JSON.parse(this.props.currentWorkshop).parts
          this.props.dispatch(setCurrentParts(currentParts))
        })
      }
    }

    if (this.props.currentWorkshop !== nextProps.currentWorkshop) {
      this.setState({
        workshop: JSON.parse(nextProps.currentWorkshop)
      }, () => {
        const currentParts = JSON.parse(nextProps.currentWorkshop).parts
        this.props.dispatch(setCurrentParts(currentParts))
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearWorkshop())
  }

  getMainPaneClassName = () => {
    if (this.props.isSidebarOpen) {
      return styles.mainPane
    }

    return `${styles.mainPane} ${styles.mainPaneExpanded}`
  }

  save = (event) => {
    event.preventDefault()
    console.log('du vill spara!')
  }

  renderMainContent() {
    if (this.state.workshop) {
      return (
        <View>
          <Sidebar />
          { this.props.editing ?
            <main className={this.getMainPaneClassName()}>
              <EditorForm type={this.props.editingType} />
            </main>
            :
            <main className={this.getMainPaneClassName()}>
              <h2>{this.state.workshop.parts[this.props.activePartIndex].title}</h2>
              <ActionButtons />
              <Editor />
              <Console />
            </main>
          }
        </View>
      )
    }

    return (
      <i className={styles.spinner} />
    )
  }

  render() {
    return this.renderMainContent()
  }
}

function mapStateToProps(state) {
  return {
    isSidebarOpen: state.sidebar.open,
    currentWorkshop: state.login.currentWorkshop,
    activePartIndex: state.editor.activePartIndex,
    editing: state.editor.editing,
    editingType: state.editor.editingType
  }
}

export default connect(mapStateToProps)(Student)

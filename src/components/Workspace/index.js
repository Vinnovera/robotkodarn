import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { findWorkshopByPin, clearWorkshop, updatePartContent } from '../../actions/currentWorkshop'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import Console from './../Console'
import Spinner from './../Spinner'
import View from './../View'
import FadeIn from './../FadeIn'
import ToolsButton from './../ToolsButton'
import LinkForm from './LinkForm'
import PartTitle from './PartTitle'

import WorkspaceButtons from './WorkspaceButtons'

import styles from './workspace.css'

export class Workspace extends Component {
  constructor(props) {
    super(props)

    this.updateCode = this.updateCode.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(findWorkshopByPin(this.props.params.pin))
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

  updateCode() {
    const currentPartContent = this.props.partsToEdit[this.props.activePartIndex].content
    const workshopId = this.props.currentWorkshop._id
    const currentPartId = this.props.partsToEdit[this.props.activePartIndex]._id

    this.props.dispatch(updatePartContent(currentPartContent, workshopId, currentPartId))
  }

  renderMainContent() {
    if (this.props.currentWorkshop) {
      return (this.props.isLoggedIn && this.props.editing) ? (
        <View background="editMode">
          <ToolsButton />
          <Sidebar />

          <FadeIn>
            { (this.props.currentEditingType === 'link') ?
              <main className={this.getMainPaneClassName()}>
                <LinkForm />
              </main>
              : (
                <main className={this.getMainPaneClassName()}>
                  <PartTitle />
                  <WorkspaceButtons />
                  <Editor />
                  <button className={`${styles.saveCodeButton} ${this.props.codeSaved ? styles.saveCodeButtonSaved : ''}`} onClick={!this.props.codeSaved ? this.updateCode : ''}>
                    <div><span><FA name="check" /> Sparat</span></div>
                    <FA name="save" /> Spara kod
                  </button>
                  <Console />
                </main>
              )
            }
          </FadeIn>
        </View>
      ) : (
        <View>
          { this.props.isLoggedIn && <ToolsButton /> }
          <Sidebar />

          <FadeIn>
            <main className={this.getMainPaneClassName()}>
              { this.props.currentWorkshop.parts.length > 0 && this.props.activePartIndex >= 0 ?
                <h1 className={styles.workspaceHeadline}>{this.props.currentWorkshop.parts[this.props.activePartIndex].title}</h1>
                :
                <h1 className={styles.workspaceHeadline}>Övning</h1>
              }
              <WorkspaceButtons />
              <Editor />
              <Console />
            </main>
          </FadeIn>
        </View>
      )
    }

    return (
      <Spinner />
    )
  }

  render() {
    return this.renderMainContent()
  }
}

function mapStateToProps(state) {
  return {
    isSidebarOpen: state.sidebar.open,
    currentWorkshop: state.currentWorkshop.item,
    activePartIndex: state.editor.activePartIndex,
    activeLinkIndex: state.currentWorkshop.activeLinkIndex,
    editing: state.editor.editing,
    editingType: state.editor.editingType.type,
    partsToEdit: state.editor.partsToEdit,
    isLoggedIn: state.user.isLoggedIn,
    currentEditingType: state.currentWorkshop.currentEditingType,
    codeSaved: state.currentWorkshop.codeSaved
  }
}

export default connect(mapStateToProps)(Workspace)

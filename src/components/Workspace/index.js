import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findWorkshopByPin, clearWorkshop } from '../../actions/currentWorkshop'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import WorkspaceForm from './../WorkspaceForm'
import Console from './../Console'
import ActionButtons from './../ActionButtons'
import Spinner from './../Spinner'
import View from './../View'
import FadeIn from './../FadeIn'
import styles from './workspace.css'

export class Workspace extends Component {
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

  renderMainContent() {
    if (this.props.currentWorkshop) {
      return (
        <View>
          <Sidebar />
          { this.props.editing ?
            <FadeIn>
              <main className={this.getMainPaneClassName()}>
                <WorkspaceForm type={this.props.editingType} />
              </main>
            </FadeIn>
            :
            <FadeIn>
              <main className={this.getMainPaneClassName()}>
                { this.props.currentWorkshop.parts.length > 0 ?
                  <h1 className={styles.workspaceHeadline}>{this.props.currentWorkshop.parts[this.props.activePartIndex].title}</h1>
                  :
                  ''
                }
                <ActionButtons />
                <Editor />
                <Console />
              </main>
            </FadeIn>
          }
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
    editing: state.editor.editing,
    editingType: state.editor.editingType.type
  }
}

export default connect(mapStateToProps)(Workspace)

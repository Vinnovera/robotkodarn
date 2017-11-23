import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { compileCode, setConsoleOutput, toggleCodeButtons, pingChromeApp, pingForUSBConnection } from '../../actions/editor'
import { findWorkshopByPin, clearWorkshop } from '../../actions/currentWorkshop'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import WorkspaceForm from './../WorkspaceForm'
import Console from './../Console'
import Button from './../Button'
import Spinner from './../Spinner'
import View from './../View'
import FadeIn from './../FadeIn'
import ToolsButton from './../ToolsButton'

import styles from './workspace.css'

export class Workspace extends Component {
  componentWillMount() {
    this.props.dispatch(findWorkshopByPin(this.props.params.pin))
    this.ping(3000)
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

  ping(interval) {
    setInterval(() => {
      this.props.dispatch(pingChromeApp())
      this.props.dispatch(pingForUSBConnection())
    }, interval)

  }

  /**
   * Gives user message about compiling is taking place, and also dispatch the
   * code that is about to be compiled. If upload is set to true, code will also
   * be uploaded to Arduino.
   *
   * @param {boolean} upload true = code will be uploaded to Arduino
   */
  handleClick = (upload = false) => {
    this.props.dispatch(setConsoleOutput({
      type: 'info',
      heading: 'Testar kod',
      message: 'Skickar kod till kompilator...'
    }))

    this.props.dispatch(
      compileCode(this.props.partsToEdit[this.props.activePartIndex].content, upload)
    )

    this.props.dispatch(toggleCodeButtons(false))
  }

  renderMainContent() {
    if (this.props.currentWorkshop) {
      return (
        <View>
          { this.props.isLoggedIn && <ToolsButton /> }
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
                  <h1 className={styles.workspaceHeadline}>Övning</h1>
                }
                {
                  this.props.enabledButtons
                    ? (
                      <div className={styles.codeButtonsWrapper} >
                        <Button kind="success" handleClick={() => this.handleClick()}>
                          <FA className={styles.icons} name="cogs" />Testa min kod
                        </Button>

                        {
                          this.props.chromeAppReachable && this.props.deviceConnected
                            ? (
                              <Button kind="success" handleClick={() => this.handleClick(true)}>
                                <FA className={styles.icons} name="usb" />Ladda över kod
                              </Button>
                            )
                            : (
                              <Button kind="disabled">
                                <FA className={styles.icons} name="usb" />Ladda över kod
                              </Button>
                            )
                        }
                      </div>
                    )
                    : (
                      <div className={styles.codeButtonsWrapper} >
                        <Button kind="disabled">
                          <FA className={styles.icons} name="cogs" />Testa min kod
                        </Button>

                        <Button kind="disabled">
                          <FA className={styles.icons} name="usb" />Ladda över kod
                        </Button>
                      </div>
                    )
                }
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
    editingType: state.editor.editingType.type,
    partsToEdit: state.editor.partsToEdit,
    isLoggedIn: state.user.isLoggedIn,
    enabledButtons: state.editor.enabledButtons,
    chromeAppReachable: state.editor.chromeAppReachable,
    deviceConnected: state.editor.deviceConnected
  }
}

export default connect(mapStateToProps)(Workspace)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  compileCode,
  setConsoleOutput,
  toggleCodeButtons,
  pingChromeApp,
  pingForUSBConnection,
  animateCompileButton,
  animateUploadButton
} from '../../../actions/editor'

import Button from './../../Button'
import CogIcon from '../../Icons/CogIcon'
import USBIcon from '../../Icons/USBIcon'

import styles from './workspacebuttons.css'

export class WorkspaceButtons extends Component {
  componentWillMount() {
    this.ping(1000)
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

    if (upload) {
      this.props.dispatch(animateUploadButton(true))
    } else {
      this.props.dispatch(animateCompileButton(true))
    }

    this.props.dispatch(toggleCodeButtons(false))
  }

  render() {
    return (
      this.props.enabledButtons
        ? (
          <div className={styles.codeButtonsWrapper} >
            <Button kind="success" handleClick={() => this.handleClick()}>
              <CogIcon className={styles.cogwheelIcon} />Testa min kod
            </Button>
            {
              this.props.chromeAppReachable && this.props.deviceConnected
                ? (
                  <Button kind="success" handleClick={() => this.handleClick(true)}>
                    <USBIcon className={styles.usbIcon} />Ladda över kod
                  </Button>
                )
                : (
                  <Button kind="disabled">
                    <USBIcon className={styles.usbIcon} />Ladda över kod
                  </Button>
                )
            }
          </div>
        )
        : (
          <div className={styles.codeButtonsWrapper} >
            <Button kind="disabled">
              <CogIcon className={`${styles.cogwheelIcon} ${this.props.animatedCompileButton ? styles.compileButtonIsAnimated : ''}`} />Testa min kod
            </Button>

            <Button kind="disabled">
              <USBIcon className={`${styles.usbIcon} ${this.props.animatedUploadButton ? styles.uploadButtonIsAnimated : ''}`} />Ladda över kod
            </Button>
          </div>
        )
    )
    // return (<h1>test</h1>)
  }
}

function mapStateToProps(state) {
  return {
    activePartIndex: state.editor.activePartIndex,
    partsToEdit: state.editor.partsToEdit,
    enabledButtons: state.editor.enabledButtons,
    chromeAppReachable: state.editor.chromeAppReachable,
    deviceConnected: state.editor.deviceConnected,
    animatedCompileButton: state.editor.animatedCompileButton,
    animatedUploadButton: state.editor.animatedUploadButton
  }
}

export default connect(mapStateToProps)(WorkspaceButtons)

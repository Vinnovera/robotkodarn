import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { compileCode, setConsoleOutput } from '../../actions/editor'
import styles from './actionbuttons.css'

export class ActionButtons extends Component {
  /**
   * Gives user message about compiling is taking place, and also dispatch the
   * code that is about to be compiled. If upload is set to true, code will also
   * be uploaded to Arduino.
   *
   * @param {boolean} upload    If set to true, code will be uploaded to Arduino.
   */
  handleClick = (upload = false) => {
    this.props.dispatch(setConsoleOutput({
      type: 'info',
      heading: 'Testar kod',
      message: 'Skickar kod till kompilator...'
    }))

    this.props.dispatch(
      compileCode(this.props.currentParts[this.props.activePartIndex].code, upload)
    )
  }

  /* Currently not used.
   * Do we want to use it? If yes, maybe based
   * on consoleOutput?
   */
  renderUploadButtonClassNames = () => {
    return (this.state.consoleOutput)
      ? 'button success'
      : 'button success disabled'
  }

  render() {
    return (
      <div className={styles.actionButtonWrapper} >
        <a onClick={() => this.handleClick()} className="button success" href="#">
          <FA className={styles.icons} name="cogs" />Testa min kod
        </a>
        <a onClick={() => this.handleClick(true)} className="button success" href="#">
          <FA className={styles.icons} name="usb" />Ladda över kod
        </a>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    connectedArduino: state.editor.connectedArduino,
    currentParts: state.student.currentParts,
    activePartIndex: state.editor.activePartIndex,
    // Could we use consoleOutput to see if "Ladda över" should be activated?
    consoleOutput: state.editor.consoleOutput
  }
}

export default connect(mapStateToProps)(ActionButtons)

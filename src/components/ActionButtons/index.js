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
   * @param {boolean} upload true = code will be uploaded to Arduino
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

  render() {
    return (
      <div className={styles.actionButtonWrapper} >
        <button onClick={() => this.handleClick()} className="button success">
          <FA className={styles.icons} name="cogs" />Testa min kod
        </button>
        <button onClick={() => this.handleClick(true)} className="button success" href="#">
          <FA className={styles.icons} name="usb" />Ladda över kod
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentParts: state.student.currentParts,
    activePartIndex: state.editor.activePartIndex
  }
}

export default connect(mapStateToProps)(ActionButtons)

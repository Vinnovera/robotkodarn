import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { compileCode, pingForUSBConnection, setConsoleOutput } from '../../actions/editor'
import styles from './actionbuttons.css'

export class ActionButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      connectedArduino: null
    }

    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this)
    this.handleTestButtonClick = this.handleTestButtonClick.bind(this)
    this.renderUploadButtonClassNames = this.renderUploadButtonClassNames.bind(this)
  }

  componentDidMount() {
    // check for connected arduino every 2 seconds
    this.pingForUSBConnection(2000)
  }

  handleUploadButtonClick() {
    if (this.props.connectedArduino) {
      // setConsoleOutput takes an object with these three props.
      // type can take info, success and warning that makes the heading
      // colors to blue, green and red (or black if none provided)
      this.props.dispatch(setConsoleOutput({
        type: 'info',
        heading: 'Kompilerar',
        message: 'Skickar kod till kompilator...'
      }))

      // true = will also be uploaded to robot after compiled
      this.props.dispatch(compileCode(this.props.currentParts[this.props.activePartIndex].code, true))
    } else {
      this.props.dispatch(setConsoleOutput({
        type: 'error',
        heading: 'Fel',
        message: 'Hittade ingen inkopplad robot'
      }))
    }
  }

  handleTestButtonClick() {
    this.props.dispatch(setConsoleOutput({
      type: 'info',
      heading: 'Testar kod',
      message: 'Skickar kod till kompilator...'
    }))
    // false = will not be uploaded to robot (only compiled)
    this.props.dispatch(compileCode(this.props.currentParts[this.props.activePartIndex].code, false))
  }

  // check for connected arduino
  pingForUSBConnection(howOften) {
    setInterval(() => {
      this.props.dispatch(pingForUSBConnection())
      this.setState({
        connectedArduino: this.props.connectedArduino
      })
    }, howOften)
  }

  renderUploadButtonClassNames() {
    return (this.state.connectedArduino)
      ? 'button success'
      : 'button success disabled'
  }

  render() {
    return (
      <div className={styles.actionButtonWrapper} >
        <a onClick={this.handleTestButtonClick} className="button success" href="#">
          <FA className={styles.icons} name="cogs" />Testa min kod
        </a>
        <a onClick={this.handleUploadButtonClick} className={this.renderUploadButtonClassNames()} href="#">
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
    activePartIndex: state.editor.activePartIndex
  }
}

export default connect(mapStateToProps)(ActionButtons)

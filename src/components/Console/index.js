import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setConsoleOutput, clearConsole } from '../../actions/editor'
import styles from './console.css'

export class Console extends Component {
  constructor(props) {
    super(props)
    this.handleClearConsoleClick = this.handleClearConsoleClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compilerResponse !== this.props.compilerResponse) {
      if (nextProps.compilerResponse.response.error) {
        const msg = {
          type: 'error',
          heading: 'Något gick fel',
          message: nextProps.compilerResponse.response.error
        }

        this.props.dispatch(setConsoleOutput(msg))
      }
    }

    // Fix to make console scroll to bottom on new messages
    setTimeout(() => {
      this.scrollToBottom()
    }, 50)
  }

  handleClearConsoleClick() {
    this.props.dispatch(clearConsole())
  }

  staticscrollToBottom() {
    const consoleWrapper = document.getElementById('console')
    consoleWrapper.scrollTop = consoleWrapper.scrollHeight - consoleWrapper.clientHeight
  }

  render() {
    return (
      <div className={styles.consoleWrapper}>
        {/* TODO: Replace anchor with button */}
        <h4>Konsol <a onClick={this.handleClearConsoleClick} href="#">Rensa konsol</a></h4>
        <div className={styles.console} id="console">
          <pre>
            {
              this.props.consoleOutput.map((message) => {
                const h = (message.timestamp.getHours() < 10) ?
                  `0${message.timestamp.getHours()}` :
                  message.timestamp.getHours()

                const m = (message.timestamp.getMinutes() < 10) ?
                  `0${message.timestamp.getMinutes()}` :
                  message.timestamp.getMinutes()

                const s = (message.timestamp.getSeconds() < 10) ?
                  `0${message.timestamp.getSeconds()}` :
                  message.timestamp.getSeconds()

                const timestamp = `${h}:${m}:${s}`

                return (
                  <div key={message.key}>
                    <span className={styles.timestamp}>[{timestamp}] </span>
                    <span className={styles[message.type]}>{message.heading}:</span>
                    <br />
                    {message.message}
                  </div>
                )
              })
            }
          </pre>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    compilerResponse: state.editor.compilerResponse || '',
    consoleOutput: state.editor.consoleOutput
  }
}

export default connect(mapStateToProps)(Console)

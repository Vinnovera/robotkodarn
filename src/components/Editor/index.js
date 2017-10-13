import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import FA from 'react-fontawesome'

import { changeEditorTab, uploadCode, setConsoleOutput } from '../../actions/editor'
import { setCurrentParts } from '../../actions/workspace'
import styles from './editor.css'

export class Editor extends Component {
  constructor(props) {
    super(props)

    /* Use local state to force react to update DOM by itself
     * more easily when changed
     */
    this.state = {
      workshop: null,
      currentParts: null
    }
  }

  componentWillMount() {
    this.setState({
      workshop: this.props.workshop
    })
  }

  componentWillReceiveProps(nextProps) {
    let msg

    if (nextProps.compilerResponse !== this.props.compilerResponse) {
      if (!nextProps.compilerResponse.response.error && nextProps.willUpload) {
        msg = {
          type: 'success',
          heading: 'Kompilering klar',
          message: 'Laddar upp till robot...'
        }

        this.props.dispatch(setConsoleOutput(msg))
        this.props.dispatch(uploadCode(nextProps.compilerResponse.response))

      // If code is without error, print message to user.
      } else if (!nextProps.compilerResponse.response.error && !nextProps.willUpload) {
        msg = {
          type: 'success',
          heading: 'Kompilering klar',
          message: 'Din kod ser bra ut!'
        }

        this.props.dispatch(setConsoleOutput(msg))
      }
    }

    // Update currentParts if changed
    if (this.props.currentParts !== nextProps.currentParts) {
      this.setState({
        currentParts: nextProps.currentParts
      })
    }
  }

  onChange = (newValue) => {
    const copyOfParts = this.state.currentParts
    copyOfParts[this.props.activePartIndex].code = newValue

    this.setState({
      currentParts: copyOfParts
    })

    this.props.dispatch(setCurrentParts(copyOfParts))
  }

  handleTabClick = (userOrOriginal) => {
    this.props.dispatch(changeEditorTab(userOrOriginal))
  }


  saveToLocalStorage() {
    localStorage.setItem('code', JSON.stringify(this.state.currentParts))
  }

  renderTab() {
    if (this.props.activeTab === 'user') {
      return (
        <AceEditor
          ref="editor"
          setOptions={{
            readOnly: false
          }}
          theme="textmate"
          fontSize="16px"
          mode="c_cpp"
          onChange={this.onChange}
          name="codeEditor"
          width="auto"
          height="90%"
          editorProps={{ $blockScrolling: true }}
          value={
            this.state.currentParts.length > 0 ?
              this.state.currentParts[this.props.activePartIndex].content :
              ''
          }
          showPrintMargin={false}
        />
      )
    }
    return (
      <AceEditor
        setOptions={{
          readOnly: true
        }}
        theme="textmate"
        fontSize="16px"
        mode="c_cpp"
        name="codeEditor"
        width="auto"
        height="90%"
        editorProps={{ $blockScrolling: true }}
        value={this.state.workshop.parts[this.props.activePartIndex].code}
        showPrintMargin={false}
      />
    )
  }

  // FIXME: this.refs is depricated. Replace with best practice asap.
  // More information: https://facebook.github.io/react/docs/refs-and-the-dom.html
  renderControlPanelIfUser() {
    if (this.props.activeTab === 'user') {
      return (
        <div>
          <button className={styles.undo} onClick={() => { this.refs.editor.editor.undo() }}><FA name="undo" /></button>
          <button className={styles.redo} onClick={() => { this.refs.editor.editor.redo() }}><FA name="repeat" /></button>
        </div>
      )
    }
  }

  render() {
    if (this.state.currentParts) {
      return (
        <div className={styles.codeWrapper}>
          {this.renderControlPanelIfUser()}
          <ul>
            {/* TODO: li element should not be interactive. Replace a with button. Fix asap (also styling) */}
            <li onClick={() => this.handleTabClick('user')} className={this.props.activeTab === 'user' && styles.active}>
              <a href="#">Din kod</a>
            </li>
            <li onClick={() => this.handleTabClick('original')} className={this.props.activeTab === 'original' && styles.active}>
              <a href="#">Original</a>
            </li>
          </ul>
          {this.renderTab()}
        </div>
      )
    }

    return (
      <h1>Laddar...</h1>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeTab: state.editor.activeTab,
    compilerResponse: state.editor.compilerResponse,
    willUpload: state.editor.willUpload,
    activePartIndex: state.editor.activePartIndex,
    currentParts: state.workspace.currentParts,
    workshop: JSON.parse(state.login.currentWorkshop)
  }
}

export default connect(mapStateToProps)(Editor)

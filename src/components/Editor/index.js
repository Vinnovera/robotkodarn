import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import FA from 'react-fontawesome'
import {
  changeEditorTab,
  uploadCode,
  setConsoleOutput,
  setPartsToEdit
} from '../../actions/editor'
import styles from './editor.css'

export class Editor extends Component {
  /*
   * Make a copy of original parts and add the array in Redux state
   * if it's not already there.
   */
  componentWillMount() {
    if (this.props.partsToEdit.length === 0) {
      const copyOfParts = [...this.props.currentWorkshop.parts]
      this.props.dispatch(setPartsToEdit(copyOfParts))
    }
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
  }

  /*
   * Update Redux state on the fly
   * when user is editing a part.
   */
  onChange = (value) => {
    // Rename for easier use
    const { activePartIndex: index } = this.props

    // Copy current state and replace old content with new value
    const updatedParts = [...this.props.partsToEdit]
    updatedParts[index] = { ...updatedParts[index], content: value }

    this.props.dispatch(setPartsToEdit(updatedParts))
  }

  /**
   * Toggle between tabs (user or original)
   */
  handleTabClick = (userOrOriginal) => {
    this.props.dispatch(changeEditorTab(userOrOriginal))
  }


  /**
   * Render the Ace Editor with different content and editing
   * possibilities depending on if user has chosen 'user' or 'original'
   */
  renderAceEditor = () => {
    const { activePartIndex: index } = this.props
    const userTab = this.props.activeTab === 'user' // true if user tab is chosen

    let activeEditPart = ''
    let activeOriginalPart = ''

    if (this.props.partsToEdit.length > 0) {
      activeEditPart = this.props.partsToEdit[index].content
    }

    if (this.props.currentWorkshop.parts.length > 0) {
      activeOriginalPart = this.props.currentWorkshop.parts[index].content
    }

    return (
      <AceEditor
        ref="editor"
        theme="textmate"
        fontSize="16px"
        mode="c_cpp"
        name="codeEditor"
        width="100%"
        height="90%"
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        onChange={(...args) => userTab && this.onChange(...args)}
        setOptions={userTab ? { readOnly: false } : { readOnly: true }}
        value={userTab ? activeEditPart : activeOriginalPart}
      />
    )
  }

  /*
   * Undo and redo buttons used for going back and forth
   * when editing a specific part.
   */
  renderUndoRedo() {
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
    return (
      <div className={styles.codeWrapper}>
        {this.renderUndoRedo()}
        <ul>
          <li onClick={() => this.handleTabClick('user')} className={this.props.activeTab === 'user' && styles.active}>
            <a href="#">Din kod</a>
          </li>
          <li onClick={() => this.handleTabClick('original')} className={this.props.activeTab === 'original' && styles.active}>
            <a href="#">Original</a>
          </li>
        </ul>
        {this.renderAceEditor()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeTab: state.editor.activeTab,
    compilerResponse: state.editor.compilerResponse,
    willUpload: state.editor.willUpload,
    activePartIndex: state.editor.activePartIndex,
    partsToEdit: state.editor.partsToEdit,
    currentWorkshop: state.currentWorkshop.item
  }
}

export default connect(mapStateToProps)(Editor)

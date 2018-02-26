import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'

/*
 * Import needs to be done this way due to how `react-ace`
 * imports it's modules. Code example:
 * https://github.com/securingsincity/react-ace/blob/master/example/index.js
 */

/* eslint-disable import/no-extraneous-dependencies */
import 'brace/mode/c_cpp'
import 'brace/theme/github'
import 'brace/theme/tomorrow'
/* eslint-enable import/no-extraneous-dependencies */

import FA from 'react-fontawesome'
import { changeEditorTab, changeEditorFontSize } from '../../actions/editor'
import { setConsoleOutput } from '../../actions/console'
import { setPartsToEdit, setCodeToUnsaved, updatePartContent } from '../../actions/parts'
import { uploadCode, toggleCodeButtons, animateCompileButton } from '../../actions/workspaceButtons'

import styles from './editor.css'

export class Editor extends Component {
	constructor(props) {
		super(props)

		this.updateCode = this.updateCode.bind(this)
	}
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
				this.props.dispatch(uploadCode(nextProps.compilerResponse.response, nextProps.connectedDevice.board))

			// If code is without error, print message to user.
			} else if (!nextProps.compilerResponse.response.error && !nextProps.willUpload) {
				msg = {
					type: 'success',
					heading: 'Kompilering klar',
					message: 'Din kod ser bra ut!'
				}

				this.props.dispatch(setConsoleOutput(msg))
				this.props.dispatch(animateCompileButton(false))
				this.props.dispatch(toggleCodeButtons(true))
			}
		}
	}
	componentWillUnmount() {
		// Empty the partsToEdit so it will re-init when going in this component again
		this.props.dispatch(setPartsToEdit([]))
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

		// Set the code to be unsaved if content has been changed
		if (this.props.currentWorkshop.parts[this.props.activePartIndex].content === value) {
			this.props.dispatch(setCodeToUnsaved(false))
		} else {
			this.props.dispatch(setCodeToUnsaved(true))
		}
	}

	/*
	 * Set ref on editor
	 */
	setEditorRef = (node) => {
		this.editorRef = node
	}

	/**
	 * Toggle between tabs (user or original)
	 */
	handleTabClick = (userOrOriginal) => {
		this.props.dispatch(changeEditorTab(userOrOriginal))
	}

	changeFontSize(fontSize) {
		this.props.dispatch(changeEditorFontSize(fontSize))
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
				ref={this.setEditorRef}
				theme="tomorrow"
				fontSize="16px"
				mode="c_cpp"
				name="codeEditor"
				width="100%"
				height="calc(100% - 38.39px)"
				highlightActiveLine={userTab}
				editorProps={{ $blockScrolling: true }}
				showPrintMargin={false}
				onChange={(...args) => userTab && this.onChange(...args)}
				setOptions={{
					readOnly: !userTab,
					tabSize: 4,
					showFoldWidgets: false,
					fontSize: this.props.editorFontSize
				}}
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
					<button className={styles.undo} onClick={() => { this.editorRef.editor.undo() }}><FA name="undo" /></button>
					<button className={styles.redo} onClick={() => { this.editorRef.editor.redo() }}><FA name="repeat" /></button>
				</div>
			)
		}
	}

	renderFontSizeButtons() {
		const fontSizes = [
			{ name: 'small', size: '.9rem' },
			{ name: 'medium', size: '1rem' },
			{ name: 'large', size: '1.2rem' }
		]

		return (
			<div className={styles.fontSizeButtons}>
				{
					fontSizes.map((fontSize) => {
						return (
							<button
								key={fontSize.name}
								className={`${styles.fontSize} ${styles[fontSize.name]} ${this.props.editorFontSize === fontSize.size ? styles.active : ''}`}
								onClick={() => { this.changeFontSize(fontSize.size) }}
							>
								<FA name="font" />
							</button>
						)
					})
				}
			</div>
		)
	}

	renderTabs() {
		return this.props.editing ? (
			<div>
				<button onClick={() => this.handleTabClick('original')} className={styles.activeButton}>Original</button>
			</div>
		) : (
			<div>
				<button onClick={() => this.handleTabClick('user')} className={(this.props.activeTab === 'user') ? styles.activeButton : styles.inactiveButton}>Din kod</button>
				<button onClick={() => this.handleTabClick('original')} className={(this.props.activeTab === 'original') ? styles.activeButton : styles.inactiveButton}>Original</button>
			</div>
		)
	}

	updateCode() {
		const currentPartContent = this.props.partsToEdit[this.props.activePartIndex].content
		const workshopId = this.props.currentWorkshop._id
		const currentPartId = this.props.partsToEdit[this.props.activePartIndex]._id

		this.props.dispatch(updatePartContent(currentPartContent, workshopId, currentPartId))
		this.props.dispatch(setCodeToUnsaved(false))
	}

	renderSaveCodeButton() {
		return (this.props.isLoggedIn && this.props.editing) ? (
			<div className={styles.saveCodeButtonContainer}>
				<button
					disabled={!this.props.codeIsUnsaved}
					className={`${styles.saveCodeButton} ${this.props.codeSaved ? styles.saveCodeButtonSaved : ''}`}
					onClick={!this.props.codeSaved && this.props.codeIsUnsaved ? this.updateCode : ''}
				>
					<div><span><FA name="check" /> Sparat</span></div>
					<FA name="save" /> Spara kod
				</button>
			</div>
		) : null
	}

	render() {
		return (
			<div className={`${styles.codeWrapper} ${this.props.showConsole ? '' : styles.expanded}`}>
				{this.renderTabs()}
				{/* {this.renderUndoRedo()} */}
				{this.renderFontSizeButtons()}
				{this.renderSaveCodeButton()}
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
		editing: state.editor.editing,
		connectedDevice: state.statusBar.connectedDevice,
		currentWorkshop: state.workshops.item,
		editorFontSize: state.editor.editorFontSize,
		showConsole: state.editor.showConsole,
		codeIsUnsaved: state.editor.codeIsUnsaved, // When content in editor has changed and you have unsaved content
		codeSaved: state.workshops.codeSaved, // When code is saved (when button is pressed)
		isLoggedIn: state.user.isLoggedIn
	}
}

export default connect(mapStateToProps)(Editor)

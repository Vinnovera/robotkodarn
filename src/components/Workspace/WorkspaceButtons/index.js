import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { setConsoleOutput } from '../../../actions/console'
import { pingChromeApp, pingForUSBConnection } from '../../../actions/statusBar'
import { compileCode, toggleCodeButtons, animateCompileButton, animateUploadButton } from '../../../actions/workspaceButtons'

import Button from './../../Button'
import CogIcon from '../../Icons/CogIcon'
import USBIcon from '../../Icons/USBIcon'

import styles from './workspacebuttons.css'

export class WorkspaceButtons extends Component {
	componentWillMount() {
		// this.ping(1000)
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
		const board = this.props.connectedDevice.board

		this.props.dispatch(setConsoleOutput({
			type: 'info',
			heading: 'Testar kod',
			message: 'Skickar kod till kompilator...'
		}))

		this.props.dispatch(
			compileCode(this.props.partsToEdit[this.props.activePartIndex].content, board, upload)
		)

		if (upload) {
			this.props.dispatch(animateUploadButton(true))
		} else {
			this.props.dispatch(animateCompileButton(true))
		}

		this.props.dispatch(toggleCodeButtons(false))
	}

	renderSaveButton() {
		if (this.props.isLoggedIn && this.props.editing) {
			return (
				<Button kind="success" handleClick={() => this.handleClick()}>
					<FA name="save" /> Spara kod
				</Button>
			)
		}
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
	}
}

function mapStateToProps(state) {
	return {
		activePartIndex: state.editor.activePartIndex,
		partsToEdit: state.editor.partsToEdit,
		chromeAppReachable: state.statusBar.chromeAppReachable,
		deviceConnected: state.statusBar.deviceConnected,
		enabledButtons: state.workspaceButtons.enabledButtons,
		animatedCompileButton: state.workspaceButtons.animatedCompileButton,
		animatedUploadButton: state.workspaceButtons.animatedUploadButton,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn,
		connectedDevice: state.statusBar.connectedDevice
	}
}

export default connect(mapStateToProps)(WorkspaceButtons)

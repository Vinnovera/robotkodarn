import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { setConsoleOutput, clearConsole } from '../../actions/console'
import { toggleCodeButtons, animateCompileButton } from '../../actions/workspaceButtons'
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
				this.props.dispatch(animateCompileButton(false))
				this.props.dispatch(toggleCodeButtons(true))
			}
		}
	}

	componentWillUnmount() {
		this.props.dispatch(clearConsole())
	}

	handleClearConsoleClick() {
		this.props.dispatch(clearConsole())
	}

	render() {
		return (
			<div className={styles.consoleWrapper}>
				<h3 className={styles.headline}>
					Konsol
				</h3>
				<div className={`${styles.console} ${this.props.editing ? styles.makeRoomForSaveButton : ''}`} id="console">
					<div className={styles.innerButtons}>
						<button onClick={this.handleClearConsoleClick}>
							<FA name="trash-o" />
						</button>
						<button>
							<FA name="chevron-down" />
						</button>
					</div>
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
		consoleOutput: state.editor.consoleOutput,
		editing: state.editor.editing
	}
}

export default connect(mapStateToProps)(Console)

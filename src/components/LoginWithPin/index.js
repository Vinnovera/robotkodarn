import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { findWorkshopByPin } from '../../actions/workshops'
import styles from './login.css'

import Button from '../Button'
import FadeIn from '../FadeIn'

export class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			pinInputValue: '',
			workshopNotFound: false
		}
	}

	componentWillReceiveProps(newProps) {
		// First check if new login attempt is made
		if (newProps.loginAttemptTimestamp !== this.props.loginAttemptTimestamp) {
			if (newProps.currentWorkshop === null) {
				this.setState({ workshopNotFound: true })
			} else {
				// Make sure workshopNotFound is set to false
				this.setState({ workshopNotFound: false })

				const workshop = newProps.currentWorkshop
				this.props.dispatch(routeActions.push(`/id/${workshop.pincode}`))
			}
		}
	}

	handleChange = (e) => {
		this.setState({ pinInputValue: e.target.value })
	}

	handleSubmit = (e) => {
		e.preventDefault()
		let pinToSend

		this.setState({ inputClassName: styles.input })

		if (this.state.pinInputValue.length === 0) {
			pinToSend = 'X'
		} else {
			pinToSend = this.state.pinInputValue
		}

		this.props.dispatch(findWorkshopByPin(pinToSend))
	}

	render() {
		return (
			<div className={styles.background}>
				<FadeIn>
					<div className={styles.login}>
						<h1 className={styles.headline}>Robotkodarn</h1>
						<div className={styles.loginField}>
							<form>
								<label className={styles.label} htmlFor="pin">Pinkod</label>
								{ /* eslint jsx-a11y/no-autofocus: 0 */ }
								<input autoFocus name="pin" type="number" min="0000" max="9999" value={this.state.pinInputValue} className={this.state.workshopNotFound ? styles.inputError : styles.input} onChange={this.handleChange} placeholder="Workshopens pinkod" />
								<div className={styles.buttonContainer} >
									<Button handleClick={this.handleSubmit} type="submit">Börja koda</Button>
								</div>
								{this.state.workshopNotFound ?
									<FadeIn>
										<p className={styles.info}>
											Kunde inte hitta någon workshop med denna pinkod. Försök igen!
										</p>
									</FadeIn>
									:
									''
								}
							</form>
						</div>
					</div>
				</FadeIn>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		currentWorkshop: state.workshops.item,
		loginAttemptTimestamp: state.workshops.loginAttemptTimestamp
	}
}

export default connect(mapStateToProps)(Login)

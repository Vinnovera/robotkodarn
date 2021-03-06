import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import addInvitationID from '../../actions/invites'
import View from '../View'
import FadeIn from '../FadeIn'
import Button from '../Button'
import styles from './invite.css'

class Invite extends Component {
	/**
	 * Creates a unique invitation ID
	 */
	createInviteLink = () => {
		this.props.dispatch(addInvitationID())
	}

	render() {
		const invitationLinks = this.props.invite.length > 0 ?
			this.props.invite.map((invitation) => {
				const uniqueURL = `${window.location.origin}/register/${invitation}`

				return (
					<div key={invitation} className={styles.invitationWrapper}>
						<p className={styles.invitationURL} >{uniqueURL}</p>
						<a
							className={styles.shortCuts}
							href={`mailto:?body=Registrera dig här: ${uniqueURL}&subject=Inbjudan till Robotkodarn`}
							title="Skicka mejl"
						>
							<FA className={styles.envelope} name="envelope" />
						</a>
					</div>
				)
			})
			:
			''

		return (
			<View background="red">
				<FadeIn>
					<div className={styles.invite}>
						<h1 className={styles.inviteHeadline}>Bjud in nya användare</h1>
						<p>Generera en unik inbjudningslänk genom att klicka på knappen.</p>
						<div className={styles.buttonContainer}>
							<Button handleClick={this.createInviteLink}>Skapa inbjudningslänk</Button>
						</div>
						{invitationLinks}
					</div>
				</FadeIn>
			</View>
		)
	}
}


function mapStateToProps(state) {
	return {
		invite: state.invite.items,
		role: state.user.role
	}
}

export default connect(mapStateToProps)(Invite)

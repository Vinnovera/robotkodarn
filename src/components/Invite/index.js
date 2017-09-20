import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'

import { isLoggedIn, signOut } from '../../actions/authentication'
import addInvitationID from '../../actions/invites'
import styles from './invite.css'
import Logo from '../Logo'

class Invite extends Component {
  componentWillMount() {
    this.props.dispatch(isLoggedIn('/invite'))
  }

  /**
   * Connect to a logout button
   */
  logOut = () => {
    this.props.dispatch(signOut('/admin'))
  }

  /**
   * TODO: Create an invite link with a unique URL. On Register page,
   * check if link exists in collection "invites". If yes, let user register
   * an account. When account is saved in database, remove the invitation link from
   * collection "invites".
   */
  createInviteLink = () => {
    const invitationID = uuidv4()
    this.props.dispatch(addInvitationID(invitationID))
  }

  render() {
    return (
      <div className={styles.invite}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <h1>Bjud in nya användare</h1>
        <p>Generera en unik registreringslänk genom att klicka på knappen.</p>
        <button
          className={styles.button}
          onClick={this.createInviteLink}
        >
          Skapa registreringslänk
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.adminpage.message
  }
}

export default connect(mapStateToProps)(Invite)

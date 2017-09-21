import React, { Component } from 'react'
import { connect } from 'react-redux'

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
    this.props.dispatch(addInvitationID())
  }

  render() {
    // This should probably be a component of it's own.
    const invitationLink = this.props.invite.length > 0 ?
      this.props.invite.map(invitation => (
        <a
          href={`http://localhost:8000/register?id=${invitation}`}
          className={styles.invitation}
          key={invitation}
        >{`localhost:8000/register?id=${invitation}`}</a>
      )) :
      ''

    return (
      <div>
        <nav className={styles.navigation}>
          <ul>
            <li>Skapa nya workshops</li>
            <li>Logga ut</li>
          </ul>
        </nav>
        <div className={styles.invite}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <h1>Bjud in nya användare</h1>
          <p>Generera en unik registreringslänk genom att klicka på knappen.</p>
          <button className={styles.button} onClick={this.createInviteLink} >
            Skapa registreringslänk
          </button>
          {invitationLink}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    invite: state.invite.items,
    message: state.adminpage.message
  }
}

export default connect(mapStateToProps)(Invite)

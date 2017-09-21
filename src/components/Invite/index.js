import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { isLoggedIn, signOut } from '../../actions/authentication'
import addInvitationID from '../../actions/invites'
import Logo from '../Logo'
import styles from './invite.css'

class Invite extends Component {
  componentWillMount() {
    this.props.dispatch(isLoggedIn('/invite'))
  }

  logOut = () => {
    this.props.dispatch(signOut('/admin'))
  }

  /**
   * Creates a unique invitation ID
   */
  createInviteLink = () => {
    this.props.dispatch(addInvitationID())
  }

  /**
   * Copies the unique URL to clipboard
   *
   * @param {string} url The unique invitation URL
   */
  copyToClipboard = (url) => {
    // TODO: Copy link to clipboard
    console.log(url)
  }

  render() {
    const invitationLink = this.props.invite.length > 0 ?
      this.props.invite.map((invitation) => {
        const uniqueURL = `http://localhost:8000/register?id=${invitation}`

        return (
          <div key={invitation} className={styles.invitationWrapper}>
            <p className={styles.invitationURL} >{uniqueURL}</p>
            <button className={styles.shortCuts} onClick={() => this.copyToClipboard(uniqueURL)} title="Kopiera länken" >
              <FA name="clipboard" />
            </button>
            <a className={styles.shortCuts} href={`mailto:?body=Registrera dig här: ${uniqueURL}&subject=Inbjudan till Robotkodarn`} title="Skicka mejl">
              <FA className={styles.envelope} name="envelope" />
            </a>
          </div>
        )
      })
      :
      ''

    return (
      <div>
        <nav className={styles.navigation}>
          <ul>
            <li><a className={styles.navigationLink} href="./admin">Skapa workshops</a></li>
            <li>
              <button onClick={this.logOut} className={styles.navigationLink}>Logga ut</button>
            </li>
          </ul>
        </nav>
        <div className={styles.invite}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <h1>Bjud in nya användare</h1>
          <p>Generera en unik inbjudningslänk genom att klicka på knappen.</p>
          <button className={styles.button} onClick={this.createInviteLink} >
            Skapa inbjudningslänk
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

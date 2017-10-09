import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { checkAuthorization, signOut } from '../../actions/authentication'
import addInvitationID from '../../actions/invites'
import Logo from '../Logo'
import Navbar from './../Navbar'
import View from './../View'
import styles from './invite.css'

class Invite extends Component {
  componentWillMount() {
    // Pass in superadmin – the required role for viewing component
    this.props.dispatch(checkAuthorization('/invite', 'superadmin'))
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

  render() {
    if (this.props.role === 'superadmin') {
      const invitationLinks = this.props.invite.length > 0 ?
        this.props.invite.map((invitation) => {
          const uniqueURL = `${window.location.origin}/register/${invitation}`

          return (
            <div key={invitation} className={styles.invitationWrapper}>
              <p className={styles.invitationURL} >{uniqueURL}</p>
              <a className={styles.shortCuts} href={`mailto:?body=Registrera dig här: ${uniqueURL}&subject=Inbjudan till Robotkodarn`} title="Skicka mejl">
                <FA className={styles.envelope} name="envelope" />
              </a>
            </div>
          )
        })
        :
        ''

      return (
        <View>
          <div className={styles.invite}>
            <div className={styles.logo}><Logo /></div>
            <h1>Bjud in nya användare</h1>
            <p>Generera en unik inbjudningslänk genom att klicka på knappen.</p>
            <button className={styles.button} onClick={this.createInviteLink} >
              Skapa inbjudningslänk
            </button>
            {invitationLinks}
          </div>
        </View>
      )
    }
    return (
      <div />
    )
  }
}


function mapStateToProps(state) {
  return {
    invite: state.invite.items,
    role: state.user.loggedInUser
  }
}

export default connect(mapStateToProps)(Invite)

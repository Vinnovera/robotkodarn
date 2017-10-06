import React, { Component } from 'react'
import { connect } from 'react-redux'
import forge from 'node-forge'
import { signIn, checkAuthorization } from '../../actions/authentication'
import Button from '../Button'
import styles from './loginadmin.css'

export class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null
    }
  }

  componentWillMount() {
    this.props.dispatch(checkAuthorization('/workshops'))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.checkPassword(nextProps.user[0])
    }
  }

  handleLoginSubmit = (e) => {
    e.preventDefault()
    const md = forge.md.sha256.create()
    md.update(this.state.password)
    const hash = md.digest().toHex()
    const credentials = {
      email: this.state.email,
      password: hash
    }

    this.props.dispatch(signIn(credentials, '/workshops'))
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.login}>
          <h1 className={styles.headline}>Logga in</h1>
          <form onSubmit={this.handleLoginSubmit}>
            <label htmlFor="email">E-postadress</label>
            <input className={styles.input} onChange={e => this.setState({ email: e.target.value })} id="email" type="email" placeholder="Din e-postadress" />
            <label htmlFor="password">Lösenord</label>
            <input className={styles.input} onChange={e => this.setState({ password: e.target.value })} id="password" type="password" placeholder="Ditt lösenord" />
            <div className={styles.buttonContainer}>
              <Button type="submit">Logga in</Button>
            </div>
            <p className={styles.info}>Har du ännu inget konto? Kontakta <a href="mailto:oskar@vinnovera.se?subject=Robotkodarn" >Oskar Andersson</a> på Vinnovera.</p>
          </form>
        </div>
      </div>
    )
  }
}

export default connect()(Admin)

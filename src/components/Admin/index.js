import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router' // Are we gonna use this=?
import forge from 'node-forge'

import { toggleUserRegister, registerUser, signIn, isLoggedIn } from '../../actions/authentication'

import styles from './admin.css'

export class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null,
      nameRegister: null,
      emailRegister: null,
      passwordRegister: null
    }
  }

  componentWillMount() {
    this.props.dispatch(isLoggedIn('/adminpage'))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.checkPassword(nextProps.user[0])
    }
  }

  handleLoginSubmit(e) {
    e.preventDefault()
    console.log(1111, this.state.password)

    const md = forge.md.sha256.create()
    md.update(this.state.password)
    const hash = md.digest().toHex()
    console.log(222, this.state.password)

    const credentials = {
      email: this.state.email,
      password: hash
    }

    this.props.dispatch( signIn(credentials, '/adminpage') )
  }

  handleRegisterSubmit(e) {
    e.preventDefault()

    const md = forge.md.sha256.create()
    md.update(this.state.registerPassword)
    const hash = md.digest().toHex()

    const credentials = {
      name: this.state.registerName,
      password: hash,
      email: this.state.registerEmail
    }

    this.props.dispatch(registerUser(credentials))
  }

  handleLoginOrRegisterClick(loginOrRegister) {
    this.props.dispatch(toggleUserRegister(loginOrRegister))
  }

  // FIXME: Is ref needed anywhere else? Consider deprication.
  // Why bind?
  renderContent() {
    if (this.props.loginOrRegister === 'login') {
      return (
        <div className={styles.login}>
          <h1>Logga in</h1>
          <form onSubmit={this.handleLoginSubmit.bind(this)}>
            <label htmlFor="email">Email</label>
            <input ref="email" onChange={e => this.setState({ email: e.target.value })} id="email" type="email" />
            <label htmlFor="password">Lösenord</label>
            <input ref="password" onChange={e => this.setState({ password: e.target.value })} id="password" type="password" />
            <input type="submit" value="Logga in" />
          </form>
        </div>
      )
    }

    return (
      <div className={styles.login}>
        <h1>Registrera ny användare</h1>
        <form onSubmit={this.handleRegisterSubmit.bind(this)}>
          <label htmlFor="name">För och efternamn</label>
          <input ref="name" onChange={e => this.setState({ registerName: e.target.value })} id="name" type="text" />

          <label htmlFor="email">Email</label>
          <input ref="email" onChange={e => this.setState({ registerEmail: e.target.value })} id="email" type="text" />

          <label htmlFor="password">Lösenord</label>
          <input ref="password" onChange={ e => this.setState({registerPassword: e.target.value })} id="password" type="text" />
          <input type="submit" value="Registrera" />
        </form>
        <a href="#" onClick={() => this.handleLoginOrRegisterClick('login')}>Tillbaka till inloggning...</a>
      </div>
    )
  }

  render() {
    return (
      <div>{ this.renderContent() }</div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loginOrRegister: state.admin.loginOrRegister
  }
}

export default connect(mapStateToProps)(Admin)

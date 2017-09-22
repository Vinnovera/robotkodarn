import React, { Component } from 'react'
import forge from 'node-forge'
import { connect } from 'react-redux'

import { registerUser } from '../../actions/authentication'
import styles from './registerform.css'

export class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: null,
      email: null,
      password: null
    }
  }

  handleRegisterSubmit = (e) => {
    e.preventDefault()

    const md = forge.md.sha256.create()
    md.update(this.state.password)
    const hash = md.digest().toHex()

    const credentials = {
      name: this.state.name,
      password: hash,
      email: this.state.email
    }

    this.props.dispatch(registerUser(credentials))
  }

  render() {
    return (
      <div className={styles.register}>
        <h1>Registrera ny användare</h1>
        <form onSubmit={this.handleRegisterSubmit}>
          <label htmlFor="name">För- och efternamn</label>
          <input onChange={e => this.setState({ name: e.target.value })} id="name" type="text" autoComplete="name" />

          <label htmlFor="email" >Email</label>
          <input onChange={e => this.setState({ email: e.target.value })} id="email" type="email" autoComplete="email" />

          <label htmlFor="password">Lösenord</label>
          <input onChange={e => this.setState({ password: e.target.value })} id="password" type="password" />
          <input type="submit" value="Registrera" />
        </form>
      </div>
    )
  }
}

export default connect()(Register)


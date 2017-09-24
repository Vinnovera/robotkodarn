import React, { Component } from 'react'
import { connect } from 'react-redux'
import forge from 'node-forge'
import { signIn, isLoggedIn } from '../../actions/authentication'
import styles from './admin.css'

export class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null
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

  handleLoginSubmit = (e) => {
    e.preventDefault()
    const md = forge.md.sha256.create()
    md.update(this.state.password)
    const hash = md.digest().toHex()
    const credentials = {
      email: this.state.email,
      password: hash
    }

    this.props.dispatch(signIn(credentials, '/adminpage'))
  }

  render() {
    if (this.props.loginOrRegister === 'login') {
      return (
        <div className={styles.login}>
          <h1>Logga in</h1>
          <form onSubmit={this.handleLoginSubmit}>
            <label htmlFor="email">Email</label>
            <input onChange={e => this.setState({ email: e.target.value })} id="email" type="email" />
            <label htmlFor="password">Lösenord</label>
            <input onChange={e => this.setState({ password: e.target.value })} id="password" type="password" />
            <input type="submit" value="Logga in" />
          </form>
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    loginOrRegister: state.admin.loginOrRegister
  }
}

export default connect(mapStateToProps)(Admin)

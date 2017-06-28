import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'

import { toggleUserRegister, registerUser, signIn, isLoggedIn } from '../../actions/authentication'

import forge from 'node-forge'
import styles from './admin.css'

export class Admin extends Component {
	constructor (props) {
		super(props)

        this.state = {
            email: null,
            password: null,
            nameRegister: null,
            emailRegister: null,
            passwordRegister: null,
        }
	}

    componentWillReceiveProps(nextProps) {
        if(nextProps.user !== this.props.user) {
            this.checkPassword(nextProps.user[0])
        }
    }

    componentWillMount() {
        this.props.dispatch(isLoggedIn('/adminpage'))
    }
    
    handleLoginSubmit(e) {
        e.preventDefault()

        let md = forge.md.sha256.create()
        md.update(this.state.password)
        let hash = md.digest().toHex()

        var credentials = {
            email: this.state.email,
            password: hash
        }

        this.props.dispatch( signIn(credentials, '/adminpage') )
    }

    handleRegisterSubmit(e) {
        e.preventDefault()

        let md = forge.md.sha256.create()
        md.update(this.state.registerPassword)
        let hash = md.digest().toHex()
       
        var credentials = {
            name: this.state.registerName,
            password: hash,
            email: this.state.registerEmail,
        }

        this.props.dispatch( registerUser(credentials) )
    }

    handleLoginOrRegisterClick(loginOrRegister) {
        this.props.dispatch( toggleUserRegister(loginOrRegister) )
    }

    renderContent() {
        if (this.props.loginOrRegister === 'login') {
            return (
                <div className={styles.login}>
                    <h1>Logga in</h1>
                    <form onSubmit={this.handleLoginSubmit.bind(this)}>
                        <label htmlFor="email">Email</label>
                        <input ref="email" onChange={e => this.setState({email: e.target.value})} id="email" type="email" />
                        <label htmlFor="password">Lösenord</label>
                        <input ref="password" onChange={e => this.setState({password: e.target.value})} id="password" type="password" />
                        <input type="submit" value="Logga in" />
                    </form>
                </div>
            )
        } else {
            return (
                <div className={styles.login}>
                    <h1>Registrera ny användare</h1>
                    <form onSubmit={this.handleRegisterSubmit.bind(this)}>
                        <label htmlFor="name">För och efternamn</label>
                        <input ref="name" onChange={e => this.setState({registerName: e.target.value})} id="name" type="text" />

                        <label htmlFor="email">Email</label>
                        <input ref="email" onChange={e => this.setState({registerEmail: e.target.value})} id="email" type="text" />
                        
                        <label htmlFor="password">Lösenord</label>
                        <input ref="password" onChange={e => this.setState({registerPassword: e.target.value})} id="password" type="text" />
                        <input type="submit" value="Registrera" />
                    </form>
                    <a href="#" onClick={() => this.handleLoginOrRegisterClick('login')}>Tillbaka till inloggning...</a>
                </div>
            )
        }
    }

	render () {
		return <div>{this.renderContent()}</div>
	}
}

function mapStateToProps (state) {
	return {
		loginOrRegister: state.admin.loginOrRegister
	}
}

export default connect(mapStateToProps)(Admin)
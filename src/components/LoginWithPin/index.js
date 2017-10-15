import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { findWorkshopByPin } from '../../actions/currentWorkshop'
import styles from './login.css'

export class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pinInputValue: '',
      workshopNotFound: false,
      inputClassName: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(newProps) {
    // First check if new login attempt is made
    if (newProps.loginAttemptTimestamp !== this.props.loginAttemptTimestamp) {
      if (newProps.currentWorkshop === 'notfound') {
        this.setState({
          workshopNotFound: true,
          inputClassName: 'animated shake'
        })
      }

      // Make sure workshopNotFound is set to false
      this.setState({ workshopNotFound: false })

      const workshop = newProps.currentWorkshop
      this.props.dispatch(routeActions.push(`/id/${workshop.pincode}`))
    }
  }

  handleChange(e) {
    this.setState({ pinInputValue: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    let pinToSend

    this.setState({ inputClassName: '' })

    if (this.state.pinInputValue.length === 0) {
      pinToSend = 'X'
    } else {
      pinToSend = this.state.pinInputValue
    }

    this.props.dispatch(findWorkshopByPin(pinToSend))
  }

  render() {
    return (
      <div className="screen">
        <div className={styles.wrapper}>
          <h1 className={styles.logo}>Robotkodarn</h1>
          <div className={styles.loginField}>
            <form>
              <input
                type="text"
                value={this.state.pinInputValue}
                className={this.state.inputClassName}
                onChange={this.handleChange}
                placeholder="Workshop PIN"
              />
              <input
                type="submit"
                onClick={this.handleSubmit}
                className="button primary"
                value="Logga in"
              />
            </form>
          </div>
        </div>
        {this.state.workshopNotFound && <p className={styles.workshopNotFound}>
          Kunde inte hitta någon workshop med denna PIN-kod
        </p>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentWorkshop: state.currentWorkshop.item,
    loginAttemptTimestamp: state.currentWorkshop.loginAttemptTimestamp
  }
}

export default connect(mapStateToProps)(Login)

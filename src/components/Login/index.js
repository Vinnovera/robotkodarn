import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { findWorkshopByPin } from '../../actions/workshops'
import styles from './login.css'
import animate from '../../animate.css'

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
    // Input has changed and new response came
    // TODO: Check every time you press?
    if (newProps.loginAttemptTimestamp !== this.props.loginAttemptTimestamp) {
      if (newProps.currentWorkshop === 'notfound') {
        this.setState({ workshopNotFound: true, inputClassName: 'animated shake' })
        // TODO: This is strange... return the whole HTML file?!
      } else if (newProps.currentWorkshop.substr(0, 1) !== '<') {
        this.setState({ workshopNotFound: false })
        const parsedWorkshop = JSON.parse(newProps.currentWorkshop)
        this.props.dispatch(routeActions.push(`/id/${parsedWorkshop.pincode}`))
      }
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
              <input type="text" value={this.state.pinInputValue} className={this.state.inputClassName}onChange={this.handleChange} placeholder="Workshop PIN" />
              <input type="submit" onClick={this.handleSubmit} className="button primary" value="Logga in" />
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
    currentWorkshop: state.login.currentWorkshop,
    loginAttemptTimestamp: state.login.loginAttemptTimestamp
  }
}

export default connect(mapStateToProps)(Login)

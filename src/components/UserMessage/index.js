import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setEditingType, toggleEditing } from '../../actions/editor'
import FadeIn from './../FadeIn'
import Button from './../Button'
import styles from './usermessage.css'

export class UserMessage extends Component {
  discardMessage = (event) => {
    event.preventDefault()
    this.props.dispatch(setEditingType('parts'))
  }

  stopEditing = (event) => {
    event.preventDefault()
    this.props.dispatch(toggleEditing())
  }

  render() {
    return (
      <FadeIn>
        <div className={styles.message}>
          <h2 className={styles.workshopPin}>Workshop: {this.props.pincode}</h2>
          <h1 className={styles.headline}>{this.props.message}</h1>
          <div className={styles.messageButtons}>
            <Button type="success" handleClick={this.discardMessage}>Fortsätt redigera</Button>
            <Button type="danger" handleClick={this.stopEditing}>Sluta redigera</Button>
          </div>
        </div>
      </FadeIn>
    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.workshops.message,
    pincode: state.currentWorkshop.item.pincode
  }
}

export default connect(mapStateToProps)(UserMessage)

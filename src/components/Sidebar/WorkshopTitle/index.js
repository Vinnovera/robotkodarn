import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import { setWorkshopTitle } from '../../../actions/workshops'

// import styles from './workshoptitle.css'
import styles from '../sidebar.css'

class WorkshopTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      inputValue: this.props.workshop.title
    }

    this.editWorkshopTitle = this.editWorkshopTitle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  editWorkshopTitle(e) {
    e.preventDefault()
    this.setState({ editing: true })
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const id = this.props.workshop._id
    const title = this.state.inputValue

    this.setState({ editing: false })
    this.props.dispatch(setWorkshopTitle(id, title))
  }

  renderTitle() {
    // If we are editing the workshop
    if (this.props.editing) {
      // If we are currently editing the workshop title
      if (this.state.editing) {
        return (
          <div className={styles.editing}>
            <form onSubmit={this.handleSubmit}>
              <button type="submit" value="title">
                <FA className={styles.pencilAnimation} name="pencil" />
                <FA className={styles.diskAnimation} name="save" />
              </button>
              <input type="text" autoFocus onChange={this.handleChange} onBlur={this.handleSubmit} value={this.state.inputValue} />
            </form>
          </div>
        )
      }
      // If we are not currently editing the title
      return (
        <div className={styles.notEditing}>
          <button onClick={this.editWorkshopTitle} value="title">
            <FA name="pencil" />
            <h2>{this.props.workshop.title}</h2>
          </button>
        </div>
      )
    }
    // If we are not in editing mode
    return (<h2 className={styles.sidebarTitle}>{this.props.workshop.title}</h2>)
  }

  render() {
    return (
      this.renderTitle()
    )
  }
}

function mapStateToProps(state) {
  return {
    editing: state.editor.editing,
    workshop: state.currentWorkshop.item
  }
}

export default connect(mapStateToProps)(WorkshopTitle)

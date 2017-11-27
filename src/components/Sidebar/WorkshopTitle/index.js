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
    this.handleSubmit      = this.handleSubmit.bind(this)
    this.handleChange      = this.handleChange.bind(this)
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

  render() {
    return (
      <div>
        {
          this.props.editing ?
            <button onClick={this.editWorkshopTitle} className={styles.sidebarTitleButton} value="title">
              <FA className={styles.addIcon} name="pencil" />
              {
                this.state.editing ?
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.inputValue}
                      onBlur={this.handleSubmit}
                    />
                  </form>
                  : <h2 className={styles.sidebarTitleEdit}>{this.props.workshop.title}</h2>
              }
            </button>
            : <h2 className={styles.sidebarTitle}>{this.props.workshop.title}</h2>
        }
      </div>
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

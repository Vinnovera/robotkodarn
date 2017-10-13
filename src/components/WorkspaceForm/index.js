import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  addLink,
  addPart
} from '../../actions/workshops'
import Button from './../Button'
import styles from './workspaceform.css'

export class WorkspaceForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: null,
      content: null
    }
  }

  save = (event) => {
    event.preventDefault()
    if (this.props.editingType === 'reference') {
      this.props.dispatch(addLink(this.state, this.props.workshop))
    } else if (this.props.editingType === 'parts') {
      this.props.dispatch(addPart(this.state, this.props.workshop))
    }
  }

  render() {
    const reference = this.props.editingType === 'reference'
    const part = this.props.editingType === 'parts'

    return (
      <form className={styles.workspaceForm} action="post">
        <div>
          <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.pincode}</h2>
          { reference ?
            <div>
              <h1 className={styles.formHeadline}>Lägg till ny referenslänk</h1>
              <label className={styles.label} htmlFor="title">Referenslänkens titel</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" />
              <label className={styles.label} htmlFor="url">Referenslänkens webbadress</label>
              <input onChange={event => this.setState({ content: event.target.value })} className={styles.input} type="url" placeholder="Webbadress till referenslänk" name="url" />
            </div>
            :
            ''
          }
          { part ?
            <div>
              <h1 className={styles.formHeadline}>Lägg till nytt delmoment</h1>
              <label className={styles.label} htmlFor="title">Delmomentets titel</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" />
              <label className={styles.label} htmlFor="code">Delmomentets kod</label>
              <input onChange={event => this.setState({ content: event.target.value })} className={styles.input} type="text" placeholder="Delmomentets kod" name="code" />
            </div>
            :
            ''
          }
          <div className={styles.flex}>
            <div className={styles.buttonContainer}><Button handleClick={this.save}>Skapa länk</Button></div>
          </div>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    editingType: state.editor.editingType,
    workshop: JSON.parse(state.login.currentWorkshop)
  }
}

export default connect(mapStateToProps)(WorkspaceForm)

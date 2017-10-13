import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  addLink,
  addPart,
  changeTitle
} from '../../actions/workshops'
import Button from './../Button'
import styles from './workspaceform.css'

export class WorkspaceForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: undefined,
      content: undefined
    }
  }

  save = (event) => {
    event.preventDefault()

    switch (this.props.editingType) {
      case 'reference':
        this.props.dispatch(addLink(this.state, this.props.workshop))
        break
      case 'parts':
        this.props.dispatch(addPart(this.state, this.props.workshop))
        break
      case 'title':
        this.props.dispatch(changeTitle(this.state, this.props.workshop))
        break
      default:
        console.log('Du har inte valt någon editing type.')
    }
  }

  render() {
    const reference = this.props.editingType === 'reference'
    const title = this.props.editingType === 'title'
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
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button handleClick={this.save}>Spara länk</Button>
                </div>
              </div>
            </div>
            :
            ''
          }
          { title ?
            <div>
              <h1 className={styles.formHeadline}>Uppdatera titel</h1>
              <label className={styles.label} htmlFor="title">Titel</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" value={this.state.title === undefined ? this.props.workshop.title : this.state.title} />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button handleClick={this.save}>Uppdatera</Button>
                </div>
              </div>
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
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button handleClick={this.save}>Skapa delmoment</Button>
                </div>
              </div>
            </div>
            :
            ''
          }
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

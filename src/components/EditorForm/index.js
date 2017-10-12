import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from './../Button'
import styles from './editorform.css'

export class EditorForm extends Component {
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
      // TODO: kalla addLink med [this.props.workshop._id] och [this.state]
    } else if (this.props.editingType === 'parts') {
      // TODO: kalla addPart med [this.props.workshop._id] och [this.state]
    }
  }

  render() {
    const reference = this.props.editingType === 'reference'
    const part = this.props.editingType === 'parts'

    return (
      <form className={styles.editorForm} action="post">
        <div>
          <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.pincode}</h2>
          { reference ?
            <div>
              <h1 className={styles.editorFormHeadline}>Lägg till ny referenslänk</h1>
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
              <h1 className={styles.editorFormHeadline}>Lägg till nytt delmoment</h1>
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

export default connect(mapStateToProps)(EditorForm)

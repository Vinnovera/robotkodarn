import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'

import {
  addLink,
  addPart,
  changeTitle
} from '../../actions/currentWorkshop'
import { setPartsToEdit, setEditingType } from '../../actions/editor'
import Button from './../Button'
import FadeIn from './../FadeIn'
import styles from './workspaceform.css'

export class WorkspaceForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      content: ''
    }
  }

  // Display message once a new message is available.
  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.props.message) {
      this.props.dispatch(setEditingType('message'))
    }
  }

  // Update parts to edit list when leaving.
  componentWillUnmount() {
    this.props.dispatch(setPartsToEdit(this.props.workshop.parts))
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

    // Reset internal state
    this.setState({
      title: '',
      content: ''
    })
  }

  discardMessage = (event) => {
    event.preventDefault()
    console.log('Du klickade')
  }

  render() {
    const reference = this.props.editingType === 'reference'
    const title = this.props.editingType === 'title'
    const part = this.props.editingType === 'parts'
    const message = this.props.editingType === 'message' // Used for displaying feedback messages.

    return (
      <form className={styles.workspaceForm} action="post">
        <div>
          <FadeIn>
            <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.pincode}</h2>
          </FadeIn>
          { reference ?
            <FadeIn>
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
            </FadeIn>
            :
            ''
          }
          { title ?
            <FadeIn>
              <h1 className={styles.formHeadline}>Uppdatera titel</h1>
              <label className={styles.label} htmlFor="title">Titel</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" value={this.state.title === undefined ? this.props.workshop.title : this.state.title} />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button handleClick={this.save}>Uppdatera</Button>
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { part ?
            <FadeIn>
              <h1 className={styles.formHeadline}>Lägg till nytt delmoment</h1>
              <label className={styles.label} htmlFor="title">Delmomentets titel</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" />
              <label className={styles.label} htmlFor="code">Delmomentets kod</label>
              <AceEditor
                className={styles.aceEditor}
                theme="textmate"
                fontSize="16px"
                mode="c_cpp"
                name="code"
                width="100%"
                height="400px"
                editorProps={{ $blockScrolling: true }}
                showPrintMargin={false}
                onChange={content => this.setState({ content })}
                setOptions={{ readOnly: false }}
                value={this.state.content}
              />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button handleClick={this.save}>Skapa delmoment</Button>
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { message ?
            <FadeIn>
              <h1 className={styles.formHeadline}>{this.props.message}</h1>
              <Button handleChange={this.discardMessage}>Okej</Button>
            </FadeIn>
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
    workshop: state.currentWorkshop.item,
    message: state.workshops.message
  }
}

export default connect(mapStateToProps)(WorkspaceForm)

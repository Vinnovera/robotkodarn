import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import { addLink, updateLink, addPart, updatePart, updateTitle } from '../../actions/currentWorkshop'
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

  // Display message whenever a new one is available.
  componentWillReceiveProps(nextProps) {
    if (nextProps.time !== this.props.time) {
      this.props.dispatch(setEditingType('message'))
    }
  }

  // Update parts to edit list and reset editing type to parts when leaving.
  componentWillUnmount() {
    this.props.dispatch(setPartsToEdit(this.props.workshop.parts))
    this.props.dispatch(setEditingType('parts'))
  }

  /**
   * Empty internal state after it's been used to temporarily
   * store information about links, titles or parts that are being
   * edited or created.
   */
  resetState = () => {
    this.setState({
      title: '',
      content: ''
    })
  }

  /**
   * Saves reference link or workshop part to database.
   */
  save = (event) => {
    event.preventDefault()
    const workshop = this.props.workshop

    if (this.props.editingType === 'parts') {
      this.props.dispatch(addPart(this.state, workshop))
    } else if (this.props.editingType === 'reference') {
      this.props.dispatch(addLink(this.state, workshop))
    }

    this.resetState()
  }

  /**
   * Takes the values that are changed in the internal state
   * and returns the object that will be saved
   * in database. Used when updating parts and links.
   */
  updatedValues = () => {
    const obj = {}

    if (this.state.title !== '') {
      obj.title = this.state.title
    }

    if (this.state.content !== '') {
      obj.content = this.state.content
    }

    return obj
  }

  /**
   * Checks if user has changed parts, reference link or title
   * and then dispatch relevant action.
   */
  update = (event) => {
    event.preventDefault()

    // First, check that user has changed something
    if (this.state.title === '' && this.state.content === '') {
      return
    }

    const workshopId = this.props.workshop._id
    const currentId = this.props.id
    const content = this.updatedValues()

    if (this.props.editingType === 'parts') {
      this.props.dispatch(updatePart(content, workshopId, currentId))
    } else if (this.props.editingType === 'reference') {
      this.props.dispatch(updateLink(content, workshopId, currentId))
    } else if (this.props.editingType === 'title') {
      this.props.dispatch(updateTitle(this.state, this.props.workshop))
    }

    this.resetState()
  }

  // TODO: Figure out what user wants to do here.
  discardMessage = (event) => {
    event.preventDefault()
    console.log('Du klickade')
  }

  render() {
    const reference = this.props.editingType === 'reference'
    const title = this.props.editingType === 'title'
    const part = this.props.editingType === 'parts'
    const message = this.props.editingType === 'message' // Used for displaying feedback messages.

    const update = this.props.id !== 'none'
    let linkToEdit
    let partToEdit

    /**
     * If user wants to update a part or a link,
     * store the current item in a variable.
     * This will be used to populate the input fields.
     */
    if (update) {
      linkToEdit = this.props.workshop.links.filter((currentLink) => {
        return currentLink._id === this.props.id
      })[0]

      partToEdit = this.props.workshop.parts.filter((currentPart) => {
        return currentPart._id === this.props.id
      })[0]
    }

    return (
      <form className={styles.workspaceForm} action="post">
        <div>
          <FadeIn>
            <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.pincode}</h2>
          </FadeIn>
          { reference ?
            <FadeIn>
              <h1 className={styles.formHeadline}>
                { update ? `Uppdatera referenslänk "${linkToEdit.title}"` : 'Lägg till ny referenslänk' }
              </h1>
              <label className={styles.label} htmlFor="title">Referenslänkens titel</label>
              <input
                onChange={event => this.setState({ title: event.target.value })}
                className={styles.input}
                type="text"
                placeholder="Den titel du vill ska synas"
                name="title"
                value={update && this.state.title === '' ? linkToEdit.title : this.state.title}
              />
              <label className={styles.label} htmlFor="url">Referenslänkens webbadress</label>
              <input
                onChange={event => this.setState({ content: event.target.value })}
                className={styles.input}
                type="url"
                placeholder="Webbadress till referenslänk"
                name="url"
                value={update && this.state.content === '' ? linkToEdit.content : this.state.content}
              />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  { update ?
                    <Button type="success" handleClick={this.update}>Uppdatera länk</Button>
                    :
                    <Button type="success" handleClick={this.save}>Spara länk</Button>
                  }
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
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den titel du vill ska synas" name="title" value={this.state.title === '' ? this.props.workshop.title : this.state.title} />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button type="success" handleClick={this.update}>Uppdatera</Button>
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { part ?
            <FadeIn>
              <h1 className={styles.formHeadline}>
                { update ? `Uppdatera delmoment "${partToEdit.title}"` : 'Lägg till nytt delmoment' }
              </h1>
              <label className={styles.label} htmlFor="title">Delmomentets titel</label>
              <input
                onChange={event => this.setState({ title: event.target.value })}
                className={styles.input}
                type="text"
                placeholder="Den titel du vill ska synas"
                name="title"
                value={update && this.state.title === '' ? partToEdit.title : this.state.title}
              />
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
                value={update && this.state.content === '' ? partToEdit.content : this.state.content}
              />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  { update ?
                    <Button type="success" handleClick={this.update}>Uppdatera delmoment</Button>
                    :
                    <Button type="success" handleClick={this.save}>Spara delmoment</Button>
                  }
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
    editingType: state.editor.editingType.type,
    id: state.editor.editingType.id,
    workshop: state.currentWorkshop.item,
    time: state.workshops.time,
    message: state.workshops.message
  }
}

export default connect(mapStateToProps)(WorkspaceForm)

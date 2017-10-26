import React, { Component } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import { addLink, updateLink, addPart, updatePart, updateTitle } from '../../actions/currentWorkshop'
import { setPartsToEdit, setEditingType } from '../../actions/editor'
import Button from './../Button'
import UserMessage from './../UserMessage'
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

    /* Reset state if it's not completely empty when user wants
     * to add a new part or link
     */
    if (!nextProps.id && (this.state.title !== '' || this.state.content !== '')) {
      this.setState({
        title: '',
        content: ''
      })
    }

    /**
     * Set internal state title with title of workshop
     */
    if (nextProps.editingType === 'title') {
      this.setState({ title: nextProps.workshop.title })
    }

    /**
     * Set internal state with link or part to edit. Used to
     * populate input fields when editing existing parts or links.
     */
    if (nextProps.id) {
      const type = nextProps.editingType === 'parts' ? 'parts' : 'reference'
      const currentItem = this.getCurrent(type, nextProps.id)

      this.setState({
        title: currentItem.title,
        content: currentItem.content
      })
    }
  }

  // Update parts to edit list and reset editing type to parts when leaving.
  componentWillUnmount() {
    this.props.dispatch(setPartsToEdit(this.props.workshop.parts))
    this.props.dispatch(setEditingType('parts'))
  }

  /**
   * Takes a string and returns the full object chosen
   *
   * @param {string} type  The image source.
   * @param {string} id    The id of the item
   * @returns {object}     The current link or part chosen
   */
  getCurrent = (type, id) => {
    let current

    if (type === 'reference') {
      current = this.props.workshop.links.filter((currentLink) => {
        return currentLink._id === id
      })[0]
    } else if (type === 'parts') {
      current = this.props.workshop.parts.filter((currentPart) => {
        return currentPart._id === id
      })[0]
    }

    return current
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

  render() {
    const reference = this.props.editingType === 'reference'
    const title = this.props.editingType === 'title'
    const part = this.props.editingType === 'parts'
    const message = this.props.editingType === 'message' // Used for displaying feedback messages.

    const update = this.props.id
    let linkToEdit
    let partToEdit

    /**
     * If user wants to update a part or a link,
     * store the current item in a variable.
     * This will be used to populate the input fields.
     */
    if (update) {
      linkToEdit = this.getCurrent('reference', this.props.id)
      partToEdit = this.getCurrent('parts', this.props.id)
    }

    return (
      <form className={styles.workspaceForm} action="post">
        <div>
          { reference ?
            <FadeIn>
              <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.title} ({this.props.workshop.pincode})</h2>
              <h1 className={styles.formHeadline}>
                { update ? `Uppdatera länk "${linkToEdit.title}"` : 'Lägg till ny länk' }
              </h1>
              <label className={styles.label} htmlFor="title">Länkens rubrik</label>
              <input
                onChange={event => this.setState({ title: event.target.value })}
                className={styles.input}
                type="text"
                placeholder="Den rubrik du vill ska synas"
                name="title"
                value={this.state.title}
              />
              <label className={styles.label} htmlFor="url">Länkens webbadress</label>
              <input
                onChange={event => this.setState({ content: event.target.value })}
                className={styles.input}
                type="url"
                placeholder="Webbadress till länk"
                name="url"
                value={this.state.content}
              />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  { update ?
                    <Button kind="success" handleClick={this.update}>Uppdatera länk</Button>
                    :
                    <Button kind="success" handleClick={this.save}>Spara länk</Button>
                  }
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { title ?
            <FadeIn>
              <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.title} ({this.props.workshop.pincode})</h2>
              <h1 className={styles.formHeadline}>Uppdatera rubrik</h1>
              <label className={styles.label} htmlFor="title">Rubrik</label>
              <input onChange={event => this.setState({ title: event.target.value })} className={styles.input} type="text" placeholder="Den rubrik du vill ska synas" name="title" value={this.state.title} />
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  <Button kind="success" handleClick={this.update}>Uppdatera</Button>
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { part ?
            <FadeIn>
              <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.title} ({this.props.workshop.pincode})</h2>
              <h1 className={styles.formHeadline}>
                { update ? `Uppdatera övning "${partToEdit.title}"` : 'Lägg till ny övning' }
              </h1>
              <label className={styles.label} htmlFor="title">Övningens rubrik</label>
              <input
                onChange={event => this.setState({ title: event.target.value })}
                className={styles.input}
                type="text"
                placeholder="Den rubrik du vill ska synas"
                name="title"
                value={this.state.title}
              />
              <label className={styles.label} htmlFor="code">Övningens kod</label>
              <div className={styles.editorWrapper}>
                <AceEditor
                  className={styles.aceEditor}
                  theme="textmate"
                  fontSize="16px"
                  mode="c_cpp"
                  name="code"
                  width="100%"
                  height="100%"
                  editorProps={{ $blockScrolling: true }}
                  showPrintMargin={false}
                  onChange={content => this.setState({ content })}
                  setOptions={{ readOnly: false }}
                  value={this.state.content}
                />
              </div>
              <div className={styles.flex}>
                <div className={styles.buttonContainer}>
                  { update ?
                    <Button kind="success" handleClick={this.update}>Uppdatera övning</Button>
                    :
                    <Button kind="success" handleClick={this.save}>Spara övning</Button>
                  }
                </div>
              </div>
            </FadeIn>
            :
            ''
          }
          { message ? <UserMessage /> : '' }
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

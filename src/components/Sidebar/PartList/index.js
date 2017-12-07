import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { updatePartTitle, addPart, removePart, setCurrentEditingType } from '../../../actions/currentWorkshop'
import { setActivePartIndex, setPartsToEdit } from '../../../actions/editor'
import styles from './partlist.css'

class PartList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editingPartIndex: null,
      inputText: null,
      deletePromptIndex: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.addPart = this.addPart.bind(this)
    this.confirmDeletion = this.confirmDeletion.bind(this)
    this.cancelDeletion = this.cancelDeletion.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // Update partsToEdit in redux state
    this.props.dispatch(setPartsToEdit(nextProps.workshop.parts))
  }

  changePart(index) {
    this.props.dispatch(setCurrentEditingType('part'))
    this.props.dispatch(setActivePartIndex(index))
  }

  editPartTitle(index) {
    this.setState({
      editingPartIndex: index,
      inputText: this.props.workshop.parts[index].title
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(updatePartTitle(
      this.state.inputText,
      this.props.workshop._id,
      this.props.workshop.parts[this.state.editingPartIndex]._id
    ))

    this.setState({
      editingPartIndex: null
    })
  }

  addPart() {
    this.props.dispatch(addPart({
      title: 'Ny övning',
      content: '/* Skriv din kod här. */'
    }, this.props.workshop._id))
  }

  promptForDelete(i) {
    this.setState({
      deletePromptIndex: i
    })
  }

  cancelDeletion() {
    this.setState({
      deletePromptIndex: null
    })
  }

  confirmDeletion() {
    this.props.dispatch(setActivePartIndex(0))
    
    const partId = this.props.workshop.parts[this.state.deletePromptIndex]._id
    this.props.dispatch(removePart(partId, this.props.workshop._id))

    this.cancelDeletion()
  }

  renderPartListItems() {
    // If we are in editing mode
    if (this.props.editing) {
      return this.props.workshop.parts.map((part, i) => {
        return (this.state.editingPartIndex === i) ? (
          <li className={styles.editing} key={part._id}>
            <form onSubmit={this.handleSubmit}>
              <button type="submit" className={styles.editPartButton}>
                <FA className={styles.pencilIcon} name="pencil" />
                <FA className={styles.diskIcon} name="save" />
              </button>
              <input autoFocus onBlur={this.handleSubmit} onChange={e => this.setState({ inputText: e.target.value })} type="text" value={this.state.inputText} />
              <button className={`${styles.deletePartButton} ${styles.deletePartButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
            </form>
          </li>
        ) : (
          <li className={`${(this.props.activePartIndex === i && this.props.currentEditingType === 'part') ? styles.activePart : ''}`} key={part._id}>
            {
              (this.state.deletePromptIndex === i) && (
                <div className={styles.deletePromptWrapper}>
                  <p>
                    Radera övning?
                    <span>
                      <button onClick={this.confirmDeletion}><FA className={styles.codeIcon} name="check-circle" /></button>
                      <button onClick={this.cancelDeletion}><FA className={styles.codeIcon} name="times-circle" /></button>
                    </span>
                  </p>
                </div>
              )
            }
            <button className={styles.editPartButton} onClick={() => this.editPartTitle(i)}><FA className={styles.codeIcon} name="pencil" /></button>
            <button className={styles.changePartButton} onClick={() => this.changePart(i)}>{part.title}</button>
            <button className={styles.deletePartButton} onClick={() => this.promptForDelete(i)}><FA className={styles.codeIcon} name="trash-o" /></button>
          </li>
        )
      })
    }

    // If we are not in editing mode
    return this.props.workshop.parts.map((part, i) => {
      return (
        <li className={`${this.props.activePartIndex === i ? styles.activePart : ''}`} key={part._id}>
          <button onClick={() => this.changePart(i)}><FA className={styles.codeIcon} name="file-code-o" /> {part.title}</button>
        </li>
      )
    })
  }

  renderAddPartButton() {
    return this.props.editing ? (
      <div className={styles.addButtonWrapper}>
        <button onClick={this.addPart}><FA name="plus" />Lägg till övning</button>
      </div>
    ) : null
  }

  render() {
    return (
      <div>
        <ul className={`${styles.partList} ${this.props.editing && styles.editingMode}`}>
          { this.renderPartListItems() }
        </ul>

        { this.renderAddPartButton() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.currentWorkshop.item,
    editing: state.editor.editing,
    editingType: state.editor.editingType.type,
    current: state.editor.editingType.id,
    activePartIndex: state.editor.activePartIndex,
    sidebarOpen: state.sidebar.open,
    currentEditingType: state.currentWorkshop.currentEditingType
  }
}

export default connect(mapStateToProps)(PartList)

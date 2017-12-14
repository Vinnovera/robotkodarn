import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { arrayMove } from 'react-sortable-hoc'
import { updatePartTitle, addPart, removePart, setCurrentEditingType, updateWorkshopParts } from '../../../actions/currentWorkshop'
import { setActivePartIndex, setPartsToEdit } from '../../../actions/editor'

import SortableList from './SortableList'

import styles from './partlist.css'

class PartList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editingPartIndex: null,
      inputValue: null,
      deletePromptIndex: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addPart = this.addPart.bind(this)
    this.confirmDeletion = this.confirmDeletion.bind(this)
    this.cancelDeletion = this.cancelDeletion.bind(this)
    this.editPartTitle = this.editPartTitle.bind(this)
    this.changePart = this.changePart.bind(this)
    this.promptForDelete = this.promptForDelete.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // Update partsToEdit in redux state
    this.props.dispatch(setPartsToEdit(nextProps.workshop.parts))
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    // TODO: parts gets broken after move function ($oid?!)
    const copyOfWorkshop = { ...this.props.workshop }
    copyOfWorkshop.parts = arrayMove(this.props.workshop.parts, oldIndex, newIndex)

    const newParts = []

    copyOfWorkshop.parts.forEach((part) => {
      newParts.push({
        title: part.title,
        content: part.content
      })
    })

    this.props.dispatch(updateWorkshopParts(copyOfWorkshop._id, newParts))

    // console.log(copyOfWorkshopsWithoutId)
  }

  changePart(index) {
    this.props.dispatch(setCurrentEditingType('part'))
    this.props.dispatch(setActivePartIndex(index))
  }

  editPartTitle(index) {
    // console.log( index )
    this.setState({
      editingPartIndex: index,
      inputValue: this.props.workshop.parts[index].title
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(updatePartTitle(
      this.state.inputValue,
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

  promptForDelete(index) {
    this.setState({
      deletePromptIndex: index
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
  handleChange(e) {
    this.setState({ inputValue: e.target.value })
  }

  renderPartListItems() {
    // If we are in editing mode
    if (this.props.editing) {
      return (<SortableList
        onSortEnd={this.onSortEnd}
        useDragHandle
        lockAxis="y"
        lockToContainerEdges
        helperClass={styles.sorting}
        parts={this.props.workshop.parts}
        editing={this.props.editing}
        editingPartIndex={this.state.editingPartIndex}
        handleFormSubmit={this.handleSubmit}
        handleInputChange={this.handleChange}
        inputValue={this.state.inputValue}
        activePartIndex={this.props.activePartIndex}
        currentEditingType={this.props.currentEditingType}
        deletePromptIndex={this.state.deletePromptIndex}
        deleteHandleClickConfirm={this.confirmDeletion}
        deleteHandleClickCancel={this.cancelDeletion}
        editPartHandleClick={this.editPartTitle}
        changePartHandleClick={this.changePart}
        deletePartHandleClick={this.promptForDelete}
      />)
    }

    // If we are not in editing mode
    return (
      <ul className={`${styles.partList} ${this.props.editing && styles.editingMode}`}>
        {
          this.props.workshop.parts.map((part, i) => {
            return (
              <li className={`${this.props.activePartIndex === i ? styles.activePart : ''}`} key={part._id}>
                <button onClick={() => this.changePart(i)}><FA className={styles.codeIcon} name="file-code-o" /> {part.title}</button>
              </li>
            )
          })
        }
      </ul>
    )
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
        { this.renderPartListItems() }
        { this.renderAddPartButton() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.currentWorkshop.item,
    editing: state.editor.editing,
    activePartIndex: state.editor.activePartIndex,
    currentEditingType: state.currentWorkshop.currentEditingType
  }
}

export default connect(mapStateToProps)(PartList)

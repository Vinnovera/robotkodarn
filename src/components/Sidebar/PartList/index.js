import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { updatePartTitle, addPart, removePart, setCurrentEditingType } from '../../../actions/currentWorkshop'
import { setActivePartIndex, setPartsToEdit } from '../../../actions/editor'
import styles from './partlist.css'

const DragHandle = SortableHandle(() => <span className={styles.sortHandler}><FA name="bars" /></span>)

const SortableItem = SortableElement(({
  key,
  index,
  partIndex,
  part,
  editingPartIndex,
  handleFormSubmit,
  handleInputChange,
  inputValue,
  activePartIndex,
  currentEditingType,
  deletePromptIndex,
  deleteHandleClickConfirm,
  deleteHandleClickCancel,
  editPartHandleClick,
  changePartHandleClick,
  deletePartHandleClick
}) => {
  return (editingPartIndex === partIndex) ? (
    <li className={styles.editing} key={key}>
      <DragHandle />
      <form onSubmit={handleFormSubmit}>
        <button type="submit" className={styles.editPartButton}>
          <FA className={styles.pencilIcon} name="pencil" />
          <FA className={styles.diskIcon} name="save" />
        </button>
        <input autoFocus onChange={handleInputChange} type="text" value={inputValue} />
        <button className={`${styles.deletePartButton} ${styles.deletePartButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
      </form>
    </li>
  ) : (
    <li className={(activePartIndex === partIndex && currentEditingType === 'part') ? styles.activePart : ''} key={part._id}>
      <DragHandle />
      {
        (deletePromptIndex === partIndex) && (
          <div className={styles.deletePromptWrapper}>
            <p>
              Radera övning?
              <span>
                <button onClick={deleteHandleClickConfirm}><FA className={styles.codeIcon} name="check-circle" /></button>
                <button onClick={deleteHandleClickCancel}><FA className={styles.codeIcon} name="times-circle" /></button>
              </span>
            </p>
          </div>
        )
      }
      <button className={styles.editPartButton} onClick={editPartHandleClick}><FA className={styles.codeIcon} name="pencil" /></button>
      <button className={styles.changePartButton} onClick={changePartHandleClick}>{part.title}</button>
      <button className={styles.deletePartButton} onClick={deletePartHandleClick}><FA className={styles.codeIcon} name="trash-o" /></button>
    </li>
  )
})

const SortableList = SortableContainer(({
  parts,
  editing,
  editingPartIndex,
  handleFormSubmit,
  handleInputChange,
  inputValue,
  activePartIndex,
  currentEditingType,
  deletePromptIndex,
  deleteHandleClickConfirm,
  deleteHandleClickCancel,
  editPartHandleClick,
  changePartHandleClick,
  deletePartHandleClick }) => {
  return (
    <ul className={`${styles.partList} ${editing ? styles.editingMode : ''}`}>
      {parts.map((part, index) => (
        <SortableItem
          key={part._id}
          index={index}
          partIndex={index}
          part={part}
          editingPartIndex={editingPartIndex}
          handleFormSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          inputValue={inputValue}
          activePartIndex={activePartIndex}
          currentEditingType={currentEditingType}
          deletePromptIndex={deletePromptIndex}
          deleteHandleClickConfirm={deleteHandleClickConfirm}
          deleteHandleClickCancel={deleteHandleClickCancel}
          editPartHandleClick={() => editPartHandleClick(index)}
          changePartHandleClick={() => changePartHandleClick(index)}
          deletePartHandleClick={() => deletePartHandleClick(index)}
        />
      ))}
    </ul>
  )
})

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
    console.log('oldIndex: ', oldIndex)
    console.log('newIndex: ', newIndex)
    // this.setState({
    //   items: arrayMove(this.state.items, oldIndex, newIndex)
    // })
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
    console.log(index)

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
      // return this.props.workshop.parts.map((part, i) => {
      //   return (this.state.editingPartIndex === i) ? (
      //     <li className={styles.editing} key={part._id}>
      //       <form onSubmit={this.handleSubmit}>
      //         <button type="submit" className={styles.editPartButton}>
      //           <FA className={styles.pencilIcon} name="pencil" />
      //           <FA className={styles.diskIcon} name="save" />
      //         </button>
      //         <input autoFocus onBlur={this.handleSubmit} onChange={this.handleChange} type="text" value={this.state.inputValue} />
      //         <button className={`${styles.deletePartButton} ${styles.deletePartButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
      //       </form>
      //     </li>
      //   ) : (
      //     <li className={`${(this.props.activePartIndex === i && this.props.currentEditingType === 'part') ? styles.activePart : ''}`} key={part._id}>
      //       {
      //         (this.state.deletePromptIndex === i) && (
      //           <div className={styles.deletePromptWrapper}>
      //             <p>
      //               Radera övning?
      //               <span>
      //                 <button onClick={this.confirmDeletion}><FA className={styles.codeIcon} name="check-circle" /></button>
      //                 <button onClick={this.cancelDeletion}><FA className={styles.codeIcon} name="times-circle" /></button>
      //               </span>
      //             </p>
      //           </div>
      //         )
      //       }
      //       <button className={styles.editPartButton} onClick={() => this.editPartTitle(i)}><FA className={styles.codeIcon} name="pencil" /></button>
      //       <button className={styles.changePartButton} onClick={() => this.changePart(i)}>{part.title}</button>
      //       <button className={styles.deletePartButton} onClick={() => this.promptForDelete(i)}><FA className={styles.codeIcon} name="trash-o" /></button>
      //     </li>
      //   )
      // })
      return (<SortableList
        onSortEnd={this.onSortEnd}
        useDragHandle
        lockAxis="y"
        lockToContainerEdges="true"
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
    editingType: state.editor.editingType.type,
    current: state.editor.editingType.id,
    activePartIndex: state.editor.activePartIndex,
    sidebarOpen: state.sidebar.open,
    currentEditingType: state.currentWorkshop.currentEditingType
  }
}

export default connect(mapStateToProps)(PartList)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'
import { arrayMove } from 'react-sortable-hoc'

import { updateLink, addLink, removeLink, setActiveLinkIndex, updateWorkshopLinks } from '../../../actions/links'
import { setCurrentEditingType } from '../../../actions/workshops'

import SortableList from './SortableList'

import styles from './linklist.css'

class LinkList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editingLinkIndex: null,
      inputValue: null,
      deletePromptIndex: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.addLink = this.addLink.bind(this)
    this.confirmDeletion = this.confirmDeletion.bind(this)
    this.cancelDeletion = this.cancelDeletion.bind(this)
    this.editLinkTitle = this.editLinkTitle.bind(this)
    this.changeLink = this.changeLink.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.promptForDelete = this.promptForDelete.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  onSortEnd({ oldIndex, newIndex }) {
    const copyOfWorkshop = { ...this.props.workshop }
    copyOfWorkshop.links = arrayMove(this.props.workshop.links, oldIndex, newIndex)

    const linkIds = []

    copyOfWorkshop.links.forEach((link) => {
      linkIds.push(link._id)
    })

    this.props.dispatch(updateWorkshopLinks(copyOfWorkshop.links, copyOfWorkshop._id, linkIds))

    if (this.props.currentEditingType === 'link') {
      if (oldIndex === this.props.activeLinkIndex) {
        this.changeLink(newIndex)
      } else if ((oldIndex < this.props.activeLinkIndex) && (newIndex >= this.props.activeLinkIndex)) {
        this.changeLink(this.props.activeLinkIndex - 1)
      } else if ((oldIndex > this.props.activeLinkIndex) && (newIndex <= this.props.activeLinkIndex)) {
        this.changeLink(this.props.activeLinkIndex + 1)
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const linkObj = { title: this.state.inputValue }
    const workshopId = this.props.workshop._id
    const linkId = this.props.workshop.links[this.state.editingLinkIndex]._id

    this.props.dispatch(updateLink(linkObj, workshopId, linkId))

    this.setState({
      editingLinkIndex: null
    })
  }


  addLink() {
    this.props.dispatch(addLink({
      title: 'Ny länk',
      content: '#'
    }, this.props.workshop._id))
  }

  promptForDelete(index) {
    this.setState({
      deletePromptIndex: index
    })
  }

  confirmDeletion() {
    // Move to the fist link if you are deleting the one you're currently on
    if (this.state.deleteLinkIndex === this.props.activeLinkIndex) {
      this.props.dispatch(setActiveLinkIndex(0))
    }

    const linkId = this.props.workshop.links[this.state.deletePromptIndex]._id
    const workshopId = this.props.workshop._id
    const linksAfterDeletion = this.props.workshop.links.filter((link) => {
      return link._id !== linkId
    })

    this.props.dispatch(removeLink(linksAfterDeletion, linkId, workshopId))

    // This resets the deletePromtIndex state
    this.cancelDeletion()
  }

  cancelDeletion() {
    this.setState({
      deletePromptIndex: null
    })
  }

  editLinkTitle(index) {
    this.setState({
      editingLinkIndex: index,
      inputValue: this.props.workshop.links[index].title
    })
  }

  changeLink(index) {
    this.props.dispatch(setCurrentEditingType('link'))
    this.props.dispatch(setActiveLinkIndex(index))
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value })
  }

  renderLinkListItems() {
    // If we are in editing mode
    if (this.props.editing) {
      return this.props.workshop.links.map((link, i) => {
        return (this.state.editingLinkIndex === i) ? (
          <li className={styles.editing} key={link._id}>
            <form onSubmit={this.handleSubmit}>
              <button type="submit" className={styles.editLinkButton}>
                <FA className={styles.pencilIcon} name="pencil" />
                <FA className={styles.diskIcon} name="save" />
              </button>
              <input autoFocus onBlur={this.handleSubmit} onChange={this.handleChange} type="text" value={this.state.inputValue} />
              <button className={`${styles.deleteLinkButton} ${styles.deleteLinkButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
            </form>
          </li>
        ) : (
          <li className={`${(this.props.activeLinkIndex === i && this.props.currentEditingType === 'link') ? styles.activeLink : ''}`} key={link._id}>
            {
              (this.state.deletePromptIndex === i) && (
                <div className={styles.deletePromptWrapper}>
                  <p>
                    Radera länk?
                    <span>
                      <button onClick={this.confirmDeletion}><FA className={styles.linkIcon} name="check-circle" /></button>
                      <button onClick={this.cancelDeletion}><FA className={styles.linkIcon} name="times-circle" /></button>
                    </span>
                  </p>
                </div>
              )
            }
            <button className={styles.editLinkButton} onClick={() => this.editLinkTitle(i)}><FA className={styles.linkIcon} name="pencil" /></button>
            <button className={styles.changeLinkButton} onClick={() => this.changeLink(i)}>{link.title}</button>
            <button className={styles.deleteLinkButton} onClick={() => this.promptForDelete(i)}><FA className={styles.linkIcon} name="trash-o" /></button>
          </li>
        )
      })
    }

    // If we are not in editing mode
    return this.props.workshop.links.map((link) => {
      return (
        <li key={link._id}>
          <Link className={styles.listLink} to={link.content} target="_blank">
            <FA className={styles.linkIcon} name="external-link" />
            {link.title}
          </Link>
        </li>
      )
    })
  }

  renderLinkListItems2() {
    // If we are in editing mode
    if (this.props.editing) {
      return (<SortableList
        onSortEnd={this.onSortEnd}
        useDragHandle
        lockAxis="y"
        lockToContainerEdges
        helperClass={styles.sorting}
        links={this.props.workshop.links}
        editing={this.props.editing}
        editingLinkIndex={this.state.editingLinkIndex}
        handleFormSubmit={this.handleSubmit}
        handleInputChange={this.handleChange}
        inputValue={this.state.inputValue}
        activeLinkIndex={this.props.activeLinkIndex}
        currentEditingType={this.props.currentEditingType}
        deletePromptIndex={this.state.deletePromptIndex}
        deleteHandleClickConfirm={this.confirmDeletion}
        deleteHandleClickCancel={this.cancelDeletion}
        editLinkHandleClick={this.editLinkTitle}
        changeLinkHandleClick={this.changeLink}
        deleteLinkHandleClick={this.promptForDelete}
        isAddingLink={this.props.isAddingLink}
      />)
    }

    // If we are not in editing mode
    return (
      <ul className={`${styles.linkList} ${this.props.editing && styles.editingMode}`}>
        {
          this.props.workshop.links.map((link) => {
            return (
              <li key={link._id}>
                <Link className={styles.listLink} to={link.content} target="_blank">
                  <FA className={styles.linkIcon} name="external-link" />
                  {link.title}
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }

  renderAddLinkButton() {
    return this.props.editing ? (
      <div className={styles.addButtonWrapper}>
        <button onClick={this.addLink}><FA name="plus" />Lägg till länk</button>
      </div>
    ) : null
  }

  render() {
    return (
      <div>
        <ul className={`${styles.linkList} ${this.props.editing && styles.editingMode}`}>
          { this.renderLinkListItems2() }
        </ul>

        { this.renderAddLinkButton() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.workshops.item,
    editing: state.editor.editing,
    editingType: state.editor.editingType.type,
    current: state.editor.editingType.id,
    activeLinkIndex: state.workshops.activeLinkIndex,
    sidebarOpen: state.sidebar.open,
    currentEditingType: state.workshops.currentEditingType,
    isAddingLink: state.workshops.isAddingLink
  }
}

export default connect(mapStateToProps)(LinkList)

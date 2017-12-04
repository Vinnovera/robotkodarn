import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'
import { updateLink, addLink, removeLink, setActiveLinkIndex } from '../../../actions/currentWorkshop'
import { setActivePartIndex } from '../../../actions/editor'
import styles from './linklist.css'

class LinkList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editingLinkIndex: null,
      inputText: null,
      deletePromptIndex: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.addLink = this.addLink.bind(this)
    this.confirmDeletion = this.confirmDeletion.bind(this)
    this.cancelDeletion = this.cancelDeletion.bind(this)
    this.editLinkTitle = this.editLinkTitle.bind(this)
    this.changeLinkIndex = this.changeLinkIndex.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()

    const title = { title: this.state.inputText }
    const workshopId = this.props.workshop._id
    const linkId = this.props.workshop.links[this.state.editingLinkIndex]._id

    this.props.dispatch(updateLink(title, workshopId, linkId))
    
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
    const linkId = this.props.workshop.links[this.state.deletePromptIndex]._id
    const workshopId = this.props.workshop._id

    this.props.dispatch(removeLink(linkId, workshopId))

    this.cancelDeletion()
  }

  cancelDeletion() {
    this.props.dispatch(setActiveLinkIndex(null))

    this.setState({
      deletePromptIndex: null
    })
  }

  editLinkTitle(index) {
    this.setState({
      editingLinkIndex: index,
      inputText: this.props.workshop.links[index].title
    })
  }

  changeLinkIndex(index) {
    this.props.dispatch(setActivePartIndex(null))
    this.props.dispatch(setActiveLinkIndex(index))
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
              <input autoFocus onBlur={this.handleSubmit} onChange={e => this.setState({ inputText: e.target.value })} type="text" value={this.state.inputText} />
              <button className={`${styles.deleteLinkButton} ${styles.deleteLinkButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
            </form>
          </li>
        ) : (
          <li className={`${this.props.activeLinkIndex === i ? styles.activeLink : ''}`} key={link._id}>
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
            <button className={styles.changeLinkButton} onClick={() => this.changeLinkIndex(i)}>{link.title}</button>
            <button className={styles.deleteLinkButton} onClick={() => this.promptForDelete(i)}><FA className={styles.linkIcon} name="trash-o" /></button>
          </li>
        )
      })
    }

    // If we are not in editing mode
    return this.props.workshop.links.map((link, i) => {
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
          { this.renderLinkListItems() }
        </ul>

        { this.renderAddLinkButton() }
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
    activeLinkIndex: state.currentWorkshop.activeLinkIndex,
    sidebarOpen: state.sidebar.open
  }
}

export default connect(mapStateToProps)(LinkList)

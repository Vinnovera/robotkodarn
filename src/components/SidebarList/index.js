import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { removeLink, removePart } from '../../actions/currentWorkshop'
import { setActivePartIndex, setEditingType } from '../../actions/editor'
import styles from './sidebarlist.css'

class SidebarList extends Component {
  /**
   * Change between which partis showing.
   */
  changePart = (index) => {
    this.props.dispatch(setActivePartIndex(index))
  }

  /**
   * Sets editing type which is used in WorkspaceForm
   * component to render relevant form.
   */
  add = () => {
    event.preventDefault()
    this.props.dispatch(setEditingType(this.props.listType))
  }

  edit = (event) => {
    event.preventDefault()
    this.props.dispatch(setEditingType(this.props.listType, event.currentTarget.value))
  }

  /**
   * Takes the event and checks whether or not it is a reference or a part
   * that should be deleted. Then dispatch the remove action.
   */
  remove = (event) => {
    event.preventDefault()
    const item = event.currentTarget.value
    const workshop = this.props.workshop._id

    if (this.props.listType === 'reference') {
      this.props.dispatch(removeLink(item, workshop))
    } else if (this.props.listType === 'parts') {
      this.props.dispatch(removePart(item, workshop))
    }
  }

  setActiveStyle = (id, index) => {
    let active

    if (!this.props.editing) {
      active = index === this.props.activePart && !this.props.editing
    } else {
      active = this.props.current === id
    }

    if (active) {
      return styles.activeListItem
    }

    return styles.listItem
  }

  renderParts() {
    return this.props.workshop.parts.map((part, index) => {
      const open = this.props.sidebarOpen

      return (
        <li className={this.setActiveStyle(part._id, index)} key={part._id}>
          <div className={open ? styles.background : styles.closedBackground} />
          { this.props.editing ?
            <div className={styles.flexContainer}>
              <button onClick={this.edit} className={styles.editItem} value={part._id}>
                <FA className={styles.editIcon} name="pencil" />
                {part.title}
              </button>
              <button onClick={this.remove} type="submit" className={styles.removeIcon} value={part._id} name="delete"><FA name="times" /></button>
            </div>
            :
            <button className={styles.listLink} onClick={() => this.changePart(index)}>
              <FA className={styles.codeIcon} name="file-code-o" />
              {part.title}
            </button>
          }
        </li>
      )
    })
  }

  renderLinks() {
    return this.props.workshop.links.map((link) => {
      const open = this.props.sidebarOpen

      return (
        <li className={this.setActiveStyle(link._id)} key={link._id}>
          <div className={open ? styles.background : styles.closedBackground} />
          { this.props.editing ?
            <div className={styles.flexContainer} >
              <button onClick={this.edit} className={styles.editItem} value={link._id}>
                <FA className={styles.editIcon} name="pencil" />
                {link.title}
              </button>
              <button onClick={this.remove} type="submit" className={styles.removeIcon} value={link._id} name="delete"><FA name="times" /></button>
            </div>
            :
            <div className={styles.flexContainer} >
              <a target="_blank" className={styles.listLink} href={link.content}>
                <FA className={styles.linkIcon} name="external-link" />
                {link.title}
              </a>
            </div>
          }
        </li>
      )
    })
  }

  render() {
    const reference = this.props.listType === 'reference'
    const parts = this.props.listType === 'parts'
    const open = this.props.sidebarOpen
    const active = (this.props.listType === this.props.editingType) && !this.props.current

    return (
      <ul className={styles.sidebarList}>
        {reference ? this.renderLinks() : ''}
        {parts ? this.renderParts() : ''}

        { this.props.editing ?
          <li className={active ? styles.activeListItem : styles.listItem}>
            { active ?
              <div className={open ? styles.background : styles.closedBackground} />
              :
              ''
            }
            <button onClick={this.add} className={styles.addItem}>
              <FA className={styles.addIcon} name="plus" />
              { reference ? 'Ny referenslänk' : '' }
              { parts ? 'Nytt delmoment' : '' }
            </button>
          </li>
          :
          ''
        }
      </ul>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.currentWorkshop.item,
    editing: state.editor.editing,
    editingType: state.editor.editingType.type,
    current: state.editor.editingType.id,
    activePart: state.editor.activePartIndex,
    sidebarOpen: state.sidebar.open
  }
}

export default connect(mapStateToProps)(SidebarList)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { removeLink, removePart } from '../../actions/currentWorkshop'
import { setActivePartIndex, setEditingType } from '../../actions/editor'
import styles from './sidebarlist.css'

class SidebarList extends Component {
  changePart = (index) => {
    this.props.dispatch(setActivePartIndex(index))
  }

  /**
   * Takes the event and checks whether or not it is a reference or a part
   * that should be deleted. Then dispatch the remove action.
   */
  remove = (event) => {
    event.preventDefault()
    const item = event.currentTarget.value
    const workshop = this.props.workshop._id

    if (this.props.type === 'reference') {
      this.props.dispatch(removeLink(item, workshop))
    } else if (this.props.type === 'parts') {
      this.props.dispatch(removePart(item, workshop))
    }
  }

  add = (event) => {
    event.preventDefault()
    this.props.dispatch(setEditingType(this.props.type))
  }

  renderParts() {
    return this.props.workshop.parts.map((part, index) => {
      const active = index === this.props.activePart
      const open = this.props.sidebarOpen

      return (
        <li className={active ? styles.activeListItem : styles.listItem} key={part._id}>
          <div className={open ? styles.background : styles.closedBackground} />
          { this.props.editing ?
            <div className={styles.flexContainer}>
              <button onClick={this.edit} className={styles.editItem}>
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
      return (
        <li className={styles.listItem} key={link._id}>
          { this.props.editing ?
            <div className={styles.flexContainer} >
              <button onClick={this.edit} className={styles.editItem}>
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
    const reference = this.props.type === 'reference'
    const parts = this.props.type === 'parts'

    return (
      <ul className={styles.sidebarList}>
        {reference ? this.renderLinks() : ''}
        {parts ? this.renderParts() : ''}
        <li className={styles.listItem}>
          { this.props.editing ?
            <button onClick={this.add} className={styles.addItem}><FA className={styles.addIcon} name="plus" />
              {parts ? 'Nytt delmoment' : ''}
              {reference ? 'Ny referenslänk' : ''}
            </button>
            :
            ''
          }
        </li>
      </ul>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.currentWorkshop.item,
    editing: state.editor.editing,
    activePart: state.editor.activePartIndex,
    sidebarOpen: state.sidebar.open
  }
}

export default connect(mapStateToProps)(SidebarList)

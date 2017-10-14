import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { removeSelectedLink, removeSelectedPart } from '../../actions/workshops'
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
      this.props.dispatch(removeSelectedLink(item, workshop))
    } else if (this.props.type === 'parts') {
      this.props.dispatch(removeSelectedPart(item, workshop))
    }
  }

  add = (event) => {
    event.preventDefault()
    this.props.dispatch(setEditingType(this.props.type))
  }

  renderParts() {
    return this.props.workshop.parts.map((part, index) => {
      return (
        <li className={styles.listItem} key={part._id}>
          { !this.props.editing ?
            <button className={styles.listLink} onClick={() => this.changePart(index)}>
              <FA name="file-code-o" />
              {part.title}
            </button>
            :
            <div>
              <button className={styles.listLink} onClick={() => this.changePart(index)}>
                {part.title}
              </button>
              <button onClick={this.remove} type="submit" className={styles.removeIcon} value={part._id} name="delete"><FA name="times" /></button>
            </div>
          }
        </li>
      )
    })
  }

  renderLinks() {
    return this.props.workshop.links.map((link) => {
      return (
        <li className={styles.listItem} key={link._id}>
          { !this.props.editing ? <FA name="external-link" /> : '' }
          <a className={styles.listLink} href={link.url}>{link.title}</a>
          { this.props.editing ?
            <button onClick={this.remove} type="submit" className={styles.removeIcon} value={link._id} name="delete"><FA name="times" /></button>
            :
            ''
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
            <button onClick={this.add}className={styles.listLink}><FA className={styles.addIcon} name="plus" />
              {parts ? 'Lägg till nytt delmoment' : ''}
              {reference ? 'Lägg till ny referenslänk' : ''}
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
    workshop: state.login.currentWorkshop,
    editing: state.editor.editing
  }
}

export default connect(mapStateToProps)(SidebarList)

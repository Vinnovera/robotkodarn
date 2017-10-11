import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { removeSelectedLink } from '../../actions/workshops'
import styles from './sidebar.css'

class ReferenceList extends Component {
  componentWillReceiveProps(nextProps) {
    console.log('nu kommer det nya!', nextProps)
  }

  removeLink = async (event) => {
    event.preventDefault()
    const currentLink = event.currentTarget
    const currentWorkshop = this.props.workshop._id

    try {
      await this.props.dispatch(removeSelectedLink(currentLink, currentWorkshop))
    } catch (error) {
      console.log(error) /* This should be a user message */
    }
  }

  renderLinks() {
    return this.props.workshop.links.map((link) => {
      return (
        <li className={styles.listItem} key={link._id}>
          { !this.props.editing ? <FA name="external-link" /> : '' }
          <a className={styles.listLink} href={link.url}>{link.title}</a>
          { this.props.editing ?
            <button onClick={this.removeLink} type="submit" className={styles.removeIcon} value={link._id} name="delete"><FA name="times" /></button>
            :
            ''
          }
        </li>
      )
    })
  }

  render() {
    return (
      <ul className={styles.sidebarList}>
        {this.renderLinks()}
        <li className={styles.listItem}>
          { this.props.editing ?
            <button className={styles.listLink}><FA className={styles.addIcon} name="plus" /> Lägg till ny referenslänk</button>
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
    workshop: JSON.parse(state.login.currentWorkshop),
    editing: state.editor.editing
  }
}

export default connect(mapStateToProps)(ReferenceList)

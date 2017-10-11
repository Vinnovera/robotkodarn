import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { setActivePartIndex } from '../../actions/editor'
import styles from './sidebar.css'

class PartList extends Component {
  changePart(index) {
    this.props.dispatch(setActivePartIndex(index))
  }

  renderParts() {
    return this.props.parts.map((part, index) => {
      return (
        <li className={styles.listItem} key={part._id}>
          <FA name="file-code-o" />
          <a className={styles.listLink} onClick={() => this.changePart(index)} href="#">
            {part.title}
          </a>
        </li>
      )
    })
  }

  render() {
    return (
      <ul className={styles.sidebarList}>
        {this.renderParts()}
      </ul>
    )
  }
}

export default connect()(PartList)

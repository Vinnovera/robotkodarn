import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import styles from './sidebar.css'

class ReferenceList extends Component {
  renderLinks() {
    return this.props.links.map((link) => {
      return (
        <li key={link._id}>
          <FA name="external-link" />
          <a target="_blank" href={link.url}>
            {link.title}
          </a>
        </li>
      )
    })
  }

  render() {
    return (
      <ul className={styles.referenceList}>
        {this.renderLinks()}
      </ul>
    )
  }
}

export default connect()(ReferenceList)

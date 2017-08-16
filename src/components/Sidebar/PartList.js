import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import FA from 'react-fontawesome'

import {setActivePartIndex} from '../../actions/editor'

import styles from './sidebar.css'

class PartList extends React.Component {

  changePart(index) {
    this.props.dispatch(setActivePartIndex(index))
  }

  renderParts() {
    return this
      .props
      .parts
      .map((part, index) => {
        return (
          <li key={part._id}>
            <FA name='file-code-o'/>
            <a onClick={() => this.changePart(index)} href="#">
              {part.title}
            </a>
          </li>
        )
      })
  }

  render() {
    return (
      <ul className={styles.partList}>
        {this.renderParts()}
      </ul>
    )
  }
}

export default connect()(PartList)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateLink } from '../../../actions/currentWorkshop'

import styles from './linkform.css'

import FadeIn from '../../FadeIn'
import Button from '../../Button'

class NameOfComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.workshop.links[this.props.activeLinkIndex].title,
      content: this.props.workshop.links[this.props.activeLinkIndex].content
    }
  }
  // TODO: Force state update? Why?
  componentWillReceiveProps(nextProps) {
    this.setState({
      title: this.props.workshop.links[nextProps.activeLinkIndex].title,
      content: this.props.workshop.links[nextProps.activeLinkIndex].content
    })
  }
  saveLink(e) {
    e.preventDefault()
    console.log( 'SPARA!' )
    // this.props.dispatch(updateLink(content, workshopId, currentId))
  }

  render() {
    return (
      <FadeIn>
        <form className={styles.linkForm}>
          <h2 className={styles.workshopPin}>Workshop: {this.props.workshop.title} ({this.props.workshop.pincode})</h2>
          <h1 className={styles.formHeadline}>
            { `Uppdatera länk ${this.props.workshop.links[this.props.activeLinkIndex].title}` }
          </h1>
          <label className={styles.label} htmlFor="title">Länkens rubrik</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            className={styles.input}
            type="text"
            placeholder="Den rubrik du vill ska synas"
            name="title"
            value={this.state.title}
          />

          <label className={styles.label} htmlFor="url">Länkens webbadress</label>
          <input
            onChange={event => this.setState({ content: event.target.value })}
            className={styles.input}
            type="url"
            placeholder="Webbadress till länk"
            name="url"
            value={this.state.content}
          />

          <div className={styles.flex}>
            <div className={styles.buttonContainer}>
              <Button kind="success" handleClick={this.saveLink}>Spara länk</Button>
            </div>
          </div>
        </form>
      </FadeIn>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.currentWorkshop.item,
    activeLinkIndex: state.currentWorkshop.activeLinkIndex
  }
}

export default connect(mapStateToProps)(NameOfComponent)

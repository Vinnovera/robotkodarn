import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import { updateLink } from '../../../actions/links'

import styles from './linkform.css'

import FadeIn from '../../FadeIn'

class LinkForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.workshop.links[this.props.activeLinkIndex].title,
      content: this.props.workshop.links[this.props.activeLinkIndex].content
    }
    this.saveLink = this.saveLink.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    // Update the forms when the link has changed
    this.setState({
      title: nextProps.workshop.links[nextProps.activeLinkIndex].title,
      content: nextProps.workshop.links[nextProps.activeLinkIndex].content
    })
  }

  saveLink(e) {
    e.preventDefault()

    const linkObj = {
      title: this.state.title,
      content: this.state.content
    }
    const workshopId = this.props.workshop._id
    const linkId = this.props.workshop.links[this.props.activeLinkIndex]._id

    if (!this.props.linkSaved) {
      this.props.dispatch(updateLink(linkObj, workshopId, linkId))
    }
  }

  render() {
    return (
      <FadeIn>
        <form onSubmit={this.saveLink} className={styles.linkForm}>
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
              <button type="submit" className={`${styles.saveLinkButton} ${this.props.linkSaved ? styles.saveLinkButtonSaved : ''}`}>
                <div><span><FA name="check" /> Sparat</span></div>
                <FA name="save" /> Spara länk
              </button>
            </div>
          </div>
        </form>
      </FadeIn>
    )
  }
}

function mapStateToProps(state) {
  return {
    workshop: state.workshops.item,
    activeLinkIndex: state.links.activeLinkIndex,
    linkSaved: state.links.linkSaved
  }
}

export default connect(mapStateToProps)(LinkForm)

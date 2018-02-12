import React, { Component } from 'react'
import { connect } from 'react-redux'

// import FA from 'react-fontawesome'

import styles from './workshopproperties.css'

class WorkshopProperties extends Component {
	componentWillReceiveProps() {
		// Update the forms when the link has changed
		// this.setState({
		// 	title: nextProps.workshop.links[nextProps.activeLinkIndex].title,
		// 	content: nextProps.workshop.links[nextProps.activeLinkIndex].content
		// })
	}

	saveLink(e) {
		e.preventDefault()

		// const linkObj = {
		// 	title: this.state.title,
		// 	content: this.state.content
		// }
		// const workshopId = this.props.workshop._id
		// const linkId = this.props.workshop.links[this.props.activeLinkIndex]._id

		if (!this.props.linkSaved) {
			// this.props.dispatch(updateLink(linkObj, workshopId, linkId))
		}
	}

	render() {
		return (
			<div>
                Du är inloggad o blablas
				<form onSubmit={this.saveLink} className={styles.linkForm}>
					<h2>hejsan</h2>
				</form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		workshop: state.workshops.item,
		activeLinkIndex: state.workshops.activeLinkIndex,
		linkSaved: state.workshops.linkSaved
	}
}

export default connect(mapStateToProps)(WorkshopProperties)

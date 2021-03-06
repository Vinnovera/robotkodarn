import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import { updatePartTitle } from '../../../actions/parts'

import styles from './parttitle.css'

class PartTitle extends Component {
	constructor(props) {
		super(props)

		this.state = {
			editing: false,
			inputValue: this.props.workshop.parts[this.props.activePartIndex].title
		}

		this.editWorkshopTitle = this.editWorkshopTitle.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	editWorkshopTitle(e) {
		e.preventDefault()
		this.setState({
			editing: true,
			inputValue: this.props.workshop.parts[this.props.activePartIndex].title
		})
	}

	handleChange(e) {
		this.setState({ inputValue: e.target.value })
	}

	handleSubmit(e) {
		e.preventDefault()
		this.setState({
			editing: false,
			inputValue: ''
		})

		this.props.dispatch(updatePartTitle(
			this.state.inputValue,
			this.props.workshop._id,
			this.props.workshop.parts[this.props.activePartIndex]._id
		))
	}

	renderTitle() {
	// If we are editing the workshop
		if (this.props.editing) {
		// If we are currently editing the workshop title
			if (this.state.editing) {
				return (
					<div className={styles.editing}>
						<form onSubmit={this.handleSubmit}>
							<button type="submit" value="title">
								<FA className={styles.pencilAnimation} name="pencil" />
								<FA className={styles.diskAnimation} name="save" />
							</button>
							<input type="text" autoFocus onBlur={this.handleSubmit} onChange={this.handleChange} value={this.state.inputValue} />
						</form>
					</div>
				)
			}
			// If we are not currently editing the title
			// TODO: Remove h2 from button and make it non click-able
			return (
				<div className={styles.notEditing}>
					<button onClick={this.editWorkshopTitle} value="title">
						<FA name="pencil" /> <h1>{this.props.workshop.parts[this.props.activePartIndex].title}</h1>
					</button>
				</div>
			)
		}
		// If we are not in editing mode
		return (<h1>{this.props.workshop.parts[this.props.activePartIndex].title}</h1>)
	}

	render() {
		return (
			this.renderTitle()
		)
	}
}

function mapStateToProps(state) {
	return {
		editing: state.editor.editing,
		workshop: state.workshops.item,
		activePartIndex: state.editor.activePartIndex
	}
}

export default connect(mapStateToProps)(PartTitle)

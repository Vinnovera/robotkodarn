import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import styles from './workshopproperties.css'

import { setWorkshopPropertiesToUnsaved, updateWorkshopProperties } from '../../actions/workshops'

class WorkshopProperties extends Component {
	constructor(props) {
		super(props)

		this.state = {
			grade: '',
			subject: '',
			hardware: '',
			isPublished: false
		}

		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.updateWorkshopProperties = this.updateWorkshopProperties.bind(this)
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
	}

	componentWillMount() {
		this.setState({
			grade: this.props.currentWorkshop.grade,
			subject: this.props.currentWorkshop.subject,
			hardware: this.props.currentWorkshop.hardware,
			isPublished: this.props.currentWorkshop.isPublished
		})
	}

	checkSaveState() {
		const { currentWorkshop } = this.props

		if (currentWorkshop.grade !== this.state.grade ||
			currentWorkshop.subject !== this.state.subject ||
			currentWorkshop.hardware !== this.state.hardware ||
			currentWorkshop.isPublished !== this.state.isPublished) {
			this.props.dispatch(setWorkshopPropertiesToUnsaved(true))
		} else {
			this.props.dispatch(setWorkshopPropertiesToUnsaved(false))
		}
	}

	handleSelectChange(e) {
		this.setState({
			[e.target[0].value]: e.target.value
		}, () => {
			this.checkSaveState()
		})
	}

	handleCheckboxChange() {
		const { grade, subject, hardware } = this.state
		if (grade && subject && hardware) {
			this.setState({
				isPublished: !this.state.isPublished
			}, () => {
				this.checkSaveState()
			})
		} else {
			alert('Du måste märka din lektion först')
		}
	}

	updateWorkshopProperties(e) {
		e.preventDefault()

		const updatedProperties = {
			grade: this.state.grade,
			subject: this.state.subject,
			hardware: this.state.hardware,
			isPublished: this.state.isPublished
		}

		this.props.dispatch(updateWorkshopProperties(this.props.currentWorkshop._id, updatedProperties))
	}

	render() {
		return (
			<div className={styles.workshopPropertiesWrapper}>
				<h2>Egenskaper för workshop {this.props.currentWorkshop.title}</h2>
				<form
					onSubmit={this.props.workshopPropertiesIsUnsaved ? this.updateWorkshopProperties : ''}
					className={styles.linkForm}
				>

					<span className={styles.formHeading}>Märk din lektion</span>

					<div className={styles.workshopMarksWrapper}>
						<div className={styles.selectWrapper}>
							<select value={this.state.grade || 'grade'} onChange={this.handleSelectChange}>
								<option disabled value="grade">Årskurs</option>
								<option value="1-3">1-3</option>
								<option value="4-6">4-6</option>
								<option value="7-9">7-9</option>
							</select>
						</div>

						<div className={styles.selectWrapper}>
							<select value={this.state.subject || 'subject'} onChange={this.handleSelectChange}>
								<option disabled value="subject">Ämne</option>
								<option value="matematik">Matematik</option>
								<option value="teknik">Teknik</option>
								<option value="fysik">Fysik</option>
								<option value="slojd">Slöjd</option>
							</select>
						</div>

						<div className={styles.selectWrapper}>
							<select value={this.state.hardware || 'hardware'} onChange={this.handleSelectChange}>
								<option disabled value="hardware">Hårdvara</option>
								<option value="uno">Uno</option>
								<option value="df-robot">DF Robot</option>
								<option value="zumo">Zumo</option>
							</select>
						</div>

					</div>

					<span className={styles.formHeading}>Ska lektionen vara publicerad?</span>

					<label className={styles.switch} htmlFor="checkbox">
						<input type="checkbox" id="checkbox" checked={this.state.isPublished} onChange={this.handleCheckboxChange} />
						<span className="slider" />
					</label>

					<div className={styles.saveButtonContainer}>

						<button
							type="submit"
							disabled={!this.props.workshopPropertiesIsUnsaved || this.props.isSavingWorkshopProperties}
							className={`${styles.saveButton} ${this.props.workshopPropertiesIsSaved ? styles.saveButtonSaved : ''}`}
						>
							<div><span><FA name="check" /> Sparat</span></div>
							<FA name="save" /> Spara egenskaper
						</button>
					</div>
				</form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		currentWorkshop: state.workshops.item,
		activeLinkIndex: state.workshops.activeLinkIndex,
		workshopPropertiesIsUnsaved: state.workshops.workshopPropertiesIsUnsaved,
		isSavingWorkshopProperties: state.workshops.isSavingWorkshopProperties,
		workshopPropertiesIsSaved: state.workshops.workshopPropertiesIsSaved
	}
}

export default connect(mapStateToProps)(WorkshopProperties)

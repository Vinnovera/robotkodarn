import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import styles from './workshopproperties.css'

class WorkshopProperties extends Component {
	constructor(props) {
		super(props)

		this.handleSelectChange = this.handleSelectChange.bind(this)

		this.state = {
			grade: '',
			subject: '',
			hardware: ''
		}
	}

	componentWillMount() {
		this.setState({
			grade: this.props.currentWorkshop.grade,
			subject: this.props.currentWorkshop.subject,
			hardware: this.props.currentWorkshop.hardware
		})
	}

	handleSelectChange(e) {
		const { currentWorkshop } = this.props

		this.setState({
			[e.target[0].value]: e.target.value
		}, () => {
			if (currentWorkshop.grade !== this.state.grade || currentWorkshop.subject !== this.state.subject || currentWorkshop.hardware !== this.state.hardware) {
				console.log('Dags att spara')
			} else {
				console.log('Disabla knappen')
			}
		})
	}

	render() {
		return (
			<div className={styles.workshopPropertiesWrapper}>
				<h2>Egenskaper för workshop {this.props.currentWorkshop.title}</h2>
				<form onSubmit={this.saveLink} className={styles.linkForm}>

					<div className={styles.workshopMarksWrapper}>
						<span>Märk din lektion</span>

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

					<div className={styles.saveButtonContainer}>
						<button
							disabled={!this.props.workshopPropertiesIsUnsaved}
							className={`${styles.saveButton} ${this.props.workshopPropertiesIsUnsaved ? styles.saveButtonSaved : ''}`}
							onClick={!this.props.codeSaved && this.props.codeIsUnsaved ? this.updateCode : ''}
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
		workshopPropertiesIsUnsaved: state.workshops.workshopPropertiesIsUnsaved
	}
}

export default connect(mapStateToProps)(WorkshopProperties)

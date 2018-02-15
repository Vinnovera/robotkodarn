import React, { Component } from 'react'
import { connect } from 'react-redux'

import FA from 'react-fontawesome'

import styles from './workshopproperties.css'

class WorkshopProperties extends Component {
	constructor(props) {
		super(props)

		this.state = {
			select: ''
		}
	}

	handleSelectChange(e) {
		console.dir(e.target)
	}

	render() {
		return (
			<div className={styles.workshopPropertiesWrapper}>
				<h2>Egenskaper för workshop {this.props.workshop.title}</h2>
				<form onSubmit={this.saveLink} className={styles.linkForm}>

					<div className={styles.workshopMarksWrapper}>
						<span>Märk din lektion</span>

						<div className={styles.selectWrapper}>
							<select onChange={this.handleSelectChange}>
								<option selected disabled value="volvo">Årskurs</option>
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="opel">Opel</option>
							</select>
						</div>

						<div className={styles.selectWrapper}>
							<select onChange={this.handleSelectChange}>
								<option selected disabled value="volvo">Ämne</option>
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="opel">Opel</option>
							</select>
						</div>

						<div className={styles.selectWrapper}>
							<select onChange={this.handleSelectChange}>
								<option selected disabled value="volvo">Hårdvara</option>
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="opel">Opel</option>
							</select>
						</div>
					</div>
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

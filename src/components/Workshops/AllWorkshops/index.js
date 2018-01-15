import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

import {
	toggleEditing,
	getAllWorkshops,
	copyWorkshop
} from '../../../actions/workshops'

import FadeIn from '../../FadeIn'
import ToolsButton from '../../ToolsButton'
import SpinnerCog from '../../SpinnerCog'

import styles from './allworkshops.css'

class AllWorkshops extends Component {
	constructor(props) {
		super(props)

		this.handleWorkshop = this.handleWorkshop.bind(this)
		this.startEditing = this.startEditing.bind(this)
		this.renderNoWorkshops = this.renderNoWorkshops.bind(this)
		this.renderListOfWorkshops = this.renderListOfWorkshops.bind(this)
		this.renderHeader = this.renderHeader.bind(this)
		this.renderCombined = this.renderCombined.bind(this)
	}

	componentWillMount() {
		this.props.dispatch(getAllWorkshops())
	}

	componentDidMount() {
		this.props.dispatch(toggleEditing(false))
	}

	handleWorkshop(event) {
		event.preventDefault()
		const { value, name } = event.currentTarget

		if (name === 'copy') {
			this.props.dispatch(copyWorkshop(value))
		}
	}

	startEditing() {
		if (!this.props.editing) {
			this.props.dispatch(toggleEditing(true))
		}
	}

	renderSpinner() {
		return (
			<div className={styles.spinnerCogWrapper}>
				<SpinnerCog fontSize="5rem" />
			</div>
		)
	}

	renderNoWorkshops() {
		return (
			<FadeIn>
				<p className={styles.info}>Du har inte skapat några workshops än.</p>
			</FadeIn>
		)
	}

	renderListOfWorkshops() {
		return (
			<FadeIn>
				<table className={styles.workshopTable}>
					<thead>
						<tr>
							<th>Namn</th>
							<th>Pinkod</th>
							<th>Kopiera</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.allWorkshops.map((workshop) => {
								return (
									<tr className={styles.workshopItem} key={workshop._id}>
										<td><Link onClick={this.startEditing} className={styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
										<td>{workshop.pincode}</td>
										<td>
											<button onClick={this.handleWorkshop} type="submit" className={styles.tableIcon} value={workshop._id} name="copy">
												<FA name="clone" />
											</button>
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</FadeIn>
		)
	}

	renderHeader() {
		return this.props.isLoggedIn ? (
			<header className={styles.header}>
				<h1 className={styles.headerTitle}>Robotkodarn</h1>
				<ToolsButton />
			</header>
		) : ''
	}

	renderCombined() {
		if (this.props.isLoadingAllWorkshops) {
			return this.renderSpinner()
		} else if (this.props.allWorkshops.length > 0) {
			return this.renderListOfWorkshops()
		}
		return this.renderNoWorkshops()
	}

	render() {
		return (
			<div className={styles.workshops}>
				<h1 className={styles.workshopHeadline}>Alla workshops</h1>
				{ this.renderCombined() }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		allWorkshops: state.workshops.allWorkshops,
		role: state.user.isLoggedIn,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn,
		isLoadingAllWorkshops: state.workshops.isLoadingAllWorkshops
	}
}

export default connect(mapStateToProps)(AllWorkshops)

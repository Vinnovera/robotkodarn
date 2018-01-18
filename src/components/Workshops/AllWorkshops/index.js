import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

import {
	toggleEditing,
	getAllWorkshops,
	copyWorkshop,
	starWorkshop,
	setActiveWorkshopsTab
} from '../../../actions/workshops'

import FadeIn from '../../FadeIn'
import ToolsButton from '../../ToolsButton'
import SpinnerCog from '../../SpinnerCog'

import styles from './allworkshops.css'
import { log } from 'util'

class AllWorkshops extends Component {
	constructor(props) {
		super(props)

		this.copyWorkshop = this.copyWorkshop.bind(this)
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

	copyWorkshop(e, workshopId) {
		e.preventDefault()
		this.props.dispatch(copyWorkshop(workshopId))
		this.props.dispatch(setActiveWorkshopsTab('user'))
	}

	starWorkshop(e, workshopId, userId) {
		e.preventDefault()
		this.props.dispatch(starWorkshop(workshopId, userId))
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
							<th>Redaktör</th>
							<th>Pinkod</th>
							<th className={styles.centered}>Kopiera</th>
							<th className={styles.centered}>Stjärnmärk</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.allWorkshops.map((workshop) => {
								return (
									<tr className={styles.workshopItem} key={workshop._id}>
										<td><Link onClick={this.startEditing} className={styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
										<td>{workshop.author.name}</td>
										<td>{workshop.pincode}</td>
										<td className={styles.centered}>
											<button onClick={e => this.copyWorkshop(e, workshop._id)} type="submit" className={styles.tableIcon}>
												<FA name="clone" />
											</button>
										</td>
										<td className={styles.centered}>
											{
												this.props.starredWorkshops.indexOf(workshop._id) !== -1
													? (
														<button onClick={e => this.starWorkshop(e, workshop._id, this.props.userId)} type="submit" className={styles.tableIcon}>
															<FA name="star" />
														</button>
													)
													: (
														<button onClick={e => this.starWorkshop(e, workshop._id, this.props.userId)} type="submit" className={styles.tableIcon}>
															<FA name="star-o" />
														</button>
													)
											}
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
		starredWorkshops: state.user.starredWorkshops,
		isLoadingAllWorkshops: state.workshops.isLoadingAllWorkshops,
		userId: state.user._id
	}
}

export default connect(mapStateToProps)(AllWorkshops)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

import {
	toggleEditing,
	getAllWorkshops,
	copyWorkshop,
	setActiveWorkshopsTab
} from '../../../actions/workshops'

import { starWorkshop, unstarWorkshop } from '../../../actions/user'

import FadeIn from '../../FadeIn'
import ToolsButton from '../../ToolsButton'
import SpinnerCog from '../../SpinnerCog'

import styles from './allworkshops.css'

class AllWorkshops extends Component {
	constructor(props) {
		super(props)

		this.copyWorkshop = this.copyWorkshop.bind(this)
		this.toggleEditing = this.toggleEditing.bind(this)
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

	starWorkshop(e, workshopId) {
		e.preventDefault()
		if (!this.props.isStarringWorkshop) {
			this.props.dispatch(starWorkshop(workshopId))
		}
	}
	unstarWorkshop(e, workshopId) {
		e.preventDefault()
		if (!this.props.isUnstarringWorkshop) {
			this.props.dispatch(unstarWorkshop(workshopId))
		}
	}

	toggleEditing() {
		this.props.dispatch(toggleEditing(false))
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
							<th>Organisation</th>
							<th>Pinkod</th>
							<th className={styles.centered}>Kopiera</th>
							<th className={styles.centered}>Stjärnmärk</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.allWorkshops.map((workshop) => {
								const isStarred = this.props.starredWorkshops.filter((starredWorkshop) => {
									return starredWorkshop._id === workshop._id
								}).length > 0

								return (
									<tr className={styles.workshopItem} key={workshop._id}>
										<td><Link onClick={this.toggleEditing} className={styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
										<td>{workshop.author.name}</td>
										<td>{workshop.author.organisation}</td>
										<td>{workshop.pincode}</td>
										<td className={styles.centered}>
											<button onClick={e => this.copyWorkshop(e, workshop._id)} type="submit" className={styles.tableIcon}>
												<FA name="clone" />
											</button>
										</td>
										<td className={styles.centered}>
											{
												isStarred
													? (
														<button onClick={e => this.unstarWorkshop(e, workshop._id)} type="submit" className={styles.tableIcon}>
															<FA name="star" />
														</button>
													)
													: (
														<button onClick={e => this.starWorkshop(e, workshop._id)} type="submit" className={styles.tableIcon}>
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
		isStarringWorkshop: state.user.isStarringWorkshop,
		isUnstarringWorkshop: state.user.isUnstarringWorkshop
	}
}

export default connect(mapStateToProps)(AllWorkshops)

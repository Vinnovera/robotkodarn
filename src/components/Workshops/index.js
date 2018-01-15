import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

import {
	toggleEditing,
	getWorkshopsByUserId,
	addWorkshop,
	copyWorkshop,
	deleteWorkshop
} from '../../actions/workshops'

import View from '../View'
import FadeIn from '../FadeIn'
import Button from '../Button'
import ToolsButton from '../ToolsButton'
import styles from './workshops.css'

class Workshops extends Component {
	constructor(props) {
		super(props)

		this.handleWorkshop = this.handleWorkshop.bind(this)
		this.startEditing = this.startEditing.bind(this)
		this.handleAddWorkshop = this.handleAddWorkshop.bind(this)
		this.renderNoWorkshops = this.renderNoWorkshops.bind(this)
		this.renderListOfWorkshops = this.renderListOfWorkshops.bind(this)
		this.renderHeader = this.renderHeader.bind(this)
		this.renderCombined = this.renderCombined.bind(this)
	}
	componentWillMount() {
		this.props.dispatch(getWorkshopsByUserId())
	}

	handleWorkshop(event) {
		event.preventDefault()
		const { value, name } = event.currentTarget

		if (name === 'copy') {
			this.props.dispatch(copyWorkshop(value))
		} else if (name === 'delete') {
			this.props.dispatch(deleteWorkshop(value))
		}
	}

	startEditing() {
		if (!this.props.editing) {
			this.props.dispatch(toggleEditing())
		}
	}

	handleAddWorkshop(event) {
		event.preventDefault()
		this.props.dispatch(addWorkshop())
	}

	renderSpinner() {
		return (
			<div className={styles.cog}>
				<FA name="cog" />
			</div>
		)
	}

	renderNoWorkshops() {
		return (
			<FadeIn>
				<p className={styles.info}>Du har inte skapat några workshops än.</p>
				<div className={styles.buttonContainer}>
					<form className={styles.form} method="post">
						<Button kind="success" handleClick={this.handleAddWorkshop}>Lägg till ny</Button>
					</form>
				</div>
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
							<th>Radera</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.userWorkshops.map((workshop) => {
								return (
									<tr className={styles.workshopItem} key={workshop._id}>
										<td><Link onClick={this.startEditing} className={styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
										<td>{workshop.pincode}</td>
										<td>
											<button onClick={this.handleWorkshop} type="submit" className={styles.tableIcon} value={workshop._id} name="copy">
												<FA name="clone" />
											</button>
										</td>
										<td>
											<button onClick={this.handleWorkshop} type="submit" className={styles.tableIconDanger} value={workshop._id} name="delete">
												<FA name="times" />
											</button>
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
				<form className={styles.form} method="post">
					<Button kind="success" handleClick={this.handleAddWorkshop}>Lägg till ny</Button>
				</form>
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
		if (this.props.isLoadingWorkshop) {
			return this.renderSpinner()
		} else if (this.props.userWorkshops.length > 0) {
			return this.renderListOfWorkshops()
		}
		return this.renderNoWorkshops()
	}

	render() {
		return (
			<View background="listWorkshopsView">
				{ this.renderHeader() }
				<div className={styles.workshops}>
					<h1 className={styles.workshopHeadline}>Mina workshops</h1>
					{ this.renderCombined() }
				</div>
			</View>
		)
	}
}

function mapStateToProps(state) {
	return {
		userWorkshops: state.workshops.userWorkshops,
		role: state.user.isLoggedIn,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn,
		isLoadingWorkshop: state.workshops.isLoadingWorkshop
	}
}

export default connect(mapStateToProps)(Workshops)

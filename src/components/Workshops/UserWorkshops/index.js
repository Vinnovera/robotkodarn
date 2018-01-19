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
} from '../../../actions/workshops'

import FadeIn from '../../FadeIn'
import Button from '../../Button'
import ToolsButton from '../../ToolsButton'
import SpinnerCog from '../../SpinnerCog'
import MyWorkshops from './MyWorkshops'
import StarredWorkshops from './StarredWorkshops'

import styles from './userworkshops.css'

class UserWorkshops extends Component {
	constructor(props) {
		super(props)

		this.handleWorkshop = this.handleWorkshop.bind(this)
		this.startEditing = this.startEditing.bind(this)
		this.handleAddWorkshop = this.handleAddWorkshop.bind(this)
		this.renderNoWorkshops = this.renderNoWorkshops.bind(this)
		this.renderListOfUserWorkshops = this.renderListOfUserWorkshops.bind(this)
		this.renderHeader = this.renderHeader.bind(this)
		this.renderCombined = this.renderCombined.bind(this)
	}

	componentWillMount() {
		this.props.dispatch(getWorkshopsByUserId())
	}

	componentDidMount() {
		this.props.dispatch(toggleEditing(false))
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
			this.props.dispatch(toggleEditing(true))
		}
	}

	handleAddWorkshop(event) {
		event.preventDefault()
		this.props.dispatch(addWorkshop())
	}

	renderSpinner() {
		return (
			<div className={styles.spinnerCogWrapper}>
				<SpinnerCog fontSize="5rem" />
			</div>
		)
	}

	renderAddButton() {
		return (
			<form className={styles.form} method="post">
				<Button disabled={this.props.isAddingWorkshop} kind="success" handleClick={this.handleAddWorkshop}>Lägg till ny</Button>
			</form>
		)
	}

	renderNoWorkshops() {
		return (
			<FadeIn>
				<p className={styles.info}>Du har inte skapat några workshops än.</p>
				<div className={styles.buttonContainer}>
					{ this.renderAddButton() }
				</div>
			</FadeIn>
		)
	}

	renderListOfUserWorkshops() {
		return (
			<FadeIn>
				<MyWorkshops
					userWorkshops={this.props.userWorkshops}
					styles={styles}
					handleWorkshop={this.handleWorkshop}
					startEditing={this.startEditing}
				/>
				{
					this.props.isAddingWorkshop
						? <div className={styles.spinnerCogWrapper}><SpinnerCog fontSize="1.5rem" style={{ marginBottom: '10px' }} /></div>
						: ''
				}
				{ this.renderAddButton() }
				{ this.renderStarred() }
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
		if (this.props.isLoadingUserWorkshops) {
			return this.renderSpinner()
		} else if (this.props.userWorkshops.length > 0) {
			return this.renderListOfUserWorkshops()
		}
		return this.renderNoWorkshops()
	}
	renderStarred() {
		console.log(this.props.allWorkshops)

		const starredWorkshops = this.props.starredWorkshops.map((starredWorkshop) => {
			return this.props.allWorkshops.filter((workshop) => {
				return workshop._id === starredWorkshop
			})[0]
		})

		console.log(starredWorkshops)
		// console.log(this.props.userWorkshops)
		return (
			<div className={styles.starredWorkshops}>
				<h2>Starred</h2>
				{/* <StarredWorkshops
					starredWorkshops={this.props.userWorkshops}
				/> */}
			</div>
		)
	}

	render() {
		return (
			<div className={styles.workshops}>
				<h2 className={styles.workshopHeadline}>Mina favoritworkshops</h2>
				{ this.renderCombined() }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		allWorkshops: state.workshops.allWorkshops,
		userWorkshops: state.workshops.userWorkshops,
		role: state.user.isLoggedIn,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn,
		isLoadingUserWorkshops: state.workshops.isLoadingUserWorkshops,
		isAddingWorkshop: state.workshops.isAddingWorkshop,
		starredWorkshops: state.user.starredWorkshops
	}
}

export default connect(mapStateToProps)(UserWorkshops)

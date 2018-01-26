import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
	toggleEditing,
	getWorkshopsByUserId,
	addWorkshop,
	copyWorkshop,
	deleteWorkshop
} from '../../../actions/workshops'

import { unstarWorkshop, setUserInfo } from '../../../actions/user'

import FadeIn from '../../FadeIn'
import Button from '../../Button'
import SpinnerCog from '../../SpinnerCog'
import MyWorkshops from './MyWorkshops'
import StarredWorkshops from './StarredWorkshops'

import styles from './userworkshops.css'


class UserWorkshops extends Component {
	constructor(props) {
		super(props)

		this.state = {
			deletePromptIndex: null
		}

		this.addWorkshop = this.addWorkshop.bind(this)
		this.copyWorkshop = this.copyWorkshop.bind(this)
		this.promptForDeletion = this.promptForDeletion.bind(this)
		this.deleteHandleClickConfirm = this.deleteHandleClickConfirm.bind(this)
		this.deleteHandleClickCancel = this.deleteHandleClickCancel.bind(this)
		this.toggleEditing = this.toggleEditing.bind(this)
		this.unstarWorkshop = this.unstarWorkshop.bind(this)
	}

	componentWillMount() {
		this.props.dispatch(getWorkshopsByUserId())
		this.props.dispatch(setUserInfo())
	}

	componentDidMount() {
		this.props.dispatch(toggleEditing(false))
	}

	addWorkshop(e) {
		e.preventDefault()
		this.props.dispatch(addWorkshop())
	}

	copyWorkshop(e, workshopId) {
		e.preventDefault()
		this.props.dispatch(copyWorkshop(workshopId))
	}

	promptForDeletion(e, workshopId, i) {
		e.preventDefault()
		this.setState({
			deletePromptIndex: i
		})
	}

	deleteHandleClickConfirm(e, workshopId) {
		e.preventDefault()
		this.setState({
			deletePromptIndex: null
		})
		this.props.dispatch(deleteWorkshop(workshopId))
	}

	deleteHandleClickCancel(e) {
		e.preventDefault()
		this.setState({
			deletePromptIndex: null
		})
	}

	unstarWorkshop(e, workshopId) {
		e.preventDefault()
		if (!this.props.isUnstarringWorkshop) {
			this.props.dispatch(unstarWorkshop(workshopId))
		}
	}

	toggleEditing(boolean = true) {
		this.props.dispatch(toggleEditing(boolean))
	}

	renderStarredWorkshops() {
		return (
			<FadeIn>
				<StarredWorkshops
					starredWorkshops={this.props.starredWorkshops}
					styles={styles}
					copyWorkshop={this.copyWorkshop}
					toggleEditing={this.toggleEditing}
					unstarWorkshop={this.unstarWorkshop}
				/>
			</FadeIn>
		)
	}

	renderUserWorkshops() {
		if (this.props.isLoadingUserWorkshops) {
			return (
				<div className={styles.spinnerCogWrapper}><SpinnerCog fontSize="5rem" /></div>
			)
		} else if (this.props.userWorkshops.length > 0) {
			return (
				<FadeIn>
					<MyWorkshops
						userWorkshops={this.props.userWorkshops}
						styles={styles}
						copyWorkshop={this.copyWorkshop}
						promptForDeletion={this.promptForDeletion}
						toggleEditing={this.toggleEditing}
						deletePromptIndex={this.state.deletePromptIndex}
						deleteHandleClickConfirm={this.deleteHandleClickConfirm}
						deleteHandleClickCancel={this.deleteHandleClickCancel}
					/>

					{ this.props.isAddingWorkshop && <div className={styles.spinnerCogWrapper}><SpinnerCog fontSize="1.5rem" style={{ marginBottom: '10px' }} /></div> }

					<form className={styles.form} method="post">
						<Button disabled={this.props.isAddingWorkshop} kind="success" handleClick={this.addWorkshop}>Lägg till ny workshop</Button>
					</form>
				</FadeIn>
			)
		}
		return (
			<div>
				<p className={styles.infoText}>Du har inga egna workshops. Tryck på knappen nedan för att skapa en ny workshop.</p>

				<form className={styles.form} method="post">
					<Button disabled={this.props.isAddingWorkshop} kind="success" handleClick={this.addWorkshop}>Lägg till ny workshop</Button>
				</form>
			</div>
		)
	}

	render() {
		return (
			<div className={styles.workshops}>
				<h2 className={styles.workshopHeadline}>Mina workshops</h2>
				{ this.renderUserWorkshops() }

				<h2 style={{ marginTop: '50px' }} className={styles.workshopHeadline}>Mina stjärnmärkta workshops</h2>
				{
					this.props.starredWorkshops && this.props.starredWorkshops.length > 0
						? this.renderStarredWorkshops()
						: <p className={styles.infoText}>Du har inga stjärnmärkta workshops.</p>
				}
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
		starredWorkshops: state.user.starredWorkshops,
		isUnstarringWorkshop: state.user.isUnstarringWorkshop
	}
}

export default connect(mapStateToProps)(UserWorkshops)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { toggleMenu } from '../../actions/menu'
import { signOut } from '../../actions/auth'
import { toggleEditing, copyWorkshop, setActiveWorkshopsTab } from '../../actions/workshops'
import { starWorkshop, unstarWorkshop } from '../../actions/user'

import styles from './menu.css'

import Button from './../Button'
import OutsideAlerter from './../OutsideAlerter'

class Menu extends Component {
	getLinkStyle = (to) => {
		if (to === this.props.path) {
			return styles.navigationLinkActive
		}
		return styles.navigationLink
	}

	signout = () => {
		this.props.dispatch(toggleMenu())
		this.props.dispatch(signOut('/admin'))
	}

	listWorkshops = () => {
		this.props.dispatch(setActiveWorkshopsTab('user'))
		this.props.dispatch(toggleMenu())
	}

	toggleMenu = () => {
		this.props.dispatch(toggleMenu())
	}

	toggleEditing = (boolean) => {
		this.props.dispatch(toggleMenu())
		this.props.dispatch(toggleEditing(boolean))
	}

	copyWorkshop = () => {
		const workshopId = this.props.currentWorkshop._id

		this.props.dispatch(toggleMenu())
		this.props.dispatch(setActiveWorkshopsTab('user'))
		this.props.dispatch(copyWorkshop(workshopId))
	}

	starWorkshop = () => {
		const workshopId = this.props.currentWorkshop._id
		this.props.dispatch(starWorkshop(workshopId))
		// this.props.dispatch(toggleMenu())
		// this.props.dispatch(setActiveWorkshopsTab('user'))
	}

	unstarWorkshop = () => {
		const workshopId = this.props.currentWorkshop._id
		this.props.dispatch(unstarWorkshop(workshopId))
	}

	render() {
		const navigationStyles = this.props.menu ? styles.navigationOpen : styles.navigation
		const pin = this.props.currentWorkshop ? this.props.currentWorkshop.pincode : ''

		// console.log(this.props.starredWorkshops.length)

		const isStarred = this.props.starredWorkshops.filter((starredWorkshop) => {
			return !!this.props.currentWorkshop && (starredWorkshop._id === this.props.currentWorkshop._id)
		}).length > 0

		return (
			<OutsideAlerter>
				<nav className={navigationStyles}>
					<button onClick={this.toggleMenu} className={styles.exit} >Stäng</button>
					<div className={styles.userInfo}>
						<p className={styles.userName}>Inloggad som: {this.props.name}</p>
						<p className={styles.userRole}>Roll: {this.props.role}</p>
					</div>
					{ this.props.currentWorkshop && (this.props.currentWorkshop.author === this.props.userId) ?
						<Link
							className={this.getLinkStyle(`/id/${pin}`)}
							onClick={() => this.toggleEditing(!this.props.editing)}
						>
							{ this.props.editing ? `Sluta redigera ${pin}` : `Redigera ${pin}`}
						</Link>
						:
						this.props.currentWorkshop ? (
							<div>
								<Link
									className={styles.navigationLink}
									onClick={this.copyWorkshop}
									to="/workshops"
								>
									Kopiera {pin}
								</Link>
								<Link
									className={styles.navigationLink}
									onClick={isStarred ? this.unstarWorkshop : this.starWorkshop}
								>
									{ isStarred ? 'Ta bort stjärnmärkning' : `Stjärnmärk ${pin}` }
								</Link>
							</div>
						) : ''
					}
					<Link className={this.getLinkStyle('/workshops')} to="/workshops" onClick={this.listWorkshops}>Lista workshops</Link>
					{this.props.role === 'superadmin' ?
						<Link className={this.getLinkStyle('/invite')} to="/invite" onClick={this.toggleMenu}>Bjud in nya användare</Link>
						:
						''
					}
					<div className={styles.buttonWrapper}>
						<Button handleClick={this.signout}>Logga ut</Button>
					</div>
				</nav>
			</OutsideAlerter>
		)
	}
}

function mapStateToProps(state) {
	return {
		role: state.user.role,
		name: state.user.name,
		menu: state.menu.open,
		userId: state.user._id,
		starredWorkshops: state.user.starredWorkshops,
		currentWorkshop: state.workshops.item,
		editing: state.editor.editing,
		path: state.routeReducer.location.pathname
	}
}

export default connect(mapStateToProps)(Menu)

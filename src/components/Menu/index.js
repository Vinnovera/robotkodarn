import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleMenu } from '../../actions/menu'
import { signOut } from '../../actions/auth'
import { toggleEditing } from '../../actions/workshops'

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

	handleMenu = () => {
		this.props.dispatch(toggleMenu())
	}

	startEditing = (boolean) => {
		this.props.dispatch(toggleMenu())
		this.props.dispatch(toggleEditing(boolean))
	}

	render() {
		const navigationStyles = this.props.menu ? styles.navigationOpen : styles.navigation
		const pin = this.props.currentWorkshop ? this.props.currentWorkshop.pincode : ''

		return (
			<OutsideAlerter>
				<nav className={navigationStyles}>
					<button onClick={this.handleMenu} className={styles.exit} >Stäng</button>
					<div className={styles.userInfo}>
						<p className={styles.userName}>Inloggad som: {this.props.name}</p>
						<p className={styles.userRole}>Roll: {this.props.role}</p>
					</div>
					{ this.props.currentWorkshop ?
						<Link className={this.getLinkStyle(`/id/${pin}`)} onClick={() => this.startEditing(!this.props.editing)}>{ this.props.editing ? `Sluta redigera ${pin}` : `Redigera ${pin}`}</Link>
						:
						''
					}
					<Link className={this.getLinkStyle('/workshops')} to="/workshops" onClick={this.handleMenu}>Mina workshops</Link>
					{this.props.role === 'superadmin' ?
						<Link className={this.getLinkStyle('/invite')} to="/invite" onClick={this.handleMenu}>Bjud in nya användare</Link>
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
		currentWorkshop: state.workshops.item,
		editing: state.editor.editing,
		path: state.routeReducer.location.pathname,
		activePartIndex: state.editor.activePartIndex
	}
}

export default connect(mapStateToProps)(Menu)

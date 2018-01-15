import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setActiveWorkshopsTab } from '../../actions/workshops'

import View from '../View'
import UserWorkshops from './UserWorkshops'
import AllWorkshops from './AllWorkshops'
import ToolsButton from '../ToolsButton'

import styles from './workshops.css'

class Workshops extends Component {
	setTab(tab) {
		this.props.dispatch(setActiveWorkshopsTab(tab))
	}

	renderHeader() {
		return this.props.isLoggedIn ? (
			<header className={styles.header}>
				<h1 className={styles.headerTitle}>Robotkodarn</h1>
				<ToolsButton />
			</header>
		) : ''
	}

	renderWorkshopList() {
		if (this.props.activeWorkshopsTab === 'user') {
			return <UserWorkshops />
		} else if (this.props.activeWorkshopsTab === 'all') {
			return <AllWorkshops />
		}
	}

	render() {
		return (
			<View background="listWorkshopsView">
				{ this.renderHeader() }

				<div className={styles.workshops}>
					<nav>
						<ul>
							<li className={`${this.props.activeWorkshopsTab === 'user' ? styles.activeTab : ''}`}>
								<button onClick={() => this.setTab('user')}>Mina workshops</button>
							</li>

							<li className={`${this.props.activeWorkshopsTab === 'all' ? styles.activeTab : ''}`}>
								<button onClick={() => this.setTab('all')}>Alla workshops</button>
							</li>
						</ul>
					</nav>
					{ this.renderWorkshopList() }
				</div>
			</View>
		)
	}
}

function mapStateToProps(state) {
	return {
		userWorkshops: state.workshops.userWorkshops,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn,
		isLoadingUserWorkshops: state.workshops.isLoadingUserWorkshops,
		isAddingWorkshop: state.workshops.isAddingWorkshop,
		activeWorkshopsTab: state.workshops.activeWorkshopsTab
	}
}

export default connect(mapStateToProps)(Workshops)

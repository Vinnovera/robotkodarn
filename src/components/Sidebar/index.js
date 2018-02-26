import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { toggleSidebar } from '../../actions/sidebar'
import { setCurrentEditingType } from '../../actions/workshops'

import PartList from './PartList'
import LinkList from './LinkList'
import StatusBar from './StatusBar'
import WorkshopTitle from './WorkshopTitle'

import styles from './sidebar.css'

class Sidebar extends Component {
	getSidebarClassName = () => {
		if (this.props.isSidebarOpen) {
			return styles.sidebar
		}

		return `${styles.sidebar} ${styles.sidebarClosed}`
	}

	getCloseBtnClassName = () => {
		if (!this.props.isSidebarOpen) {
			return styles.rotated
		}
	}

	handleSidebarClick = () => {
		this.props.dispatch(toggleSidebar(!this.props.isSidebarOpen))
	}

	showProperties = () => {
		this.props.dispatch(setCurrentEditingType('workshopProperties'))
	}

	render() {
		return (
			<aside className={this.getSidebarClassName()}>
				<h1>Robotkodarn</h1>
				<section>
					<p className={`${styles.pinCode} ${!this.props.workshop.isPublished ? styles.blurred : ''}`}>{this.props.workshop.isPublished ? this.props.workshop.pincode : 'XXXX'}</p>
					{
						this.props.editing
							? <button onClick={this.showProperties} className={styles.propertiesButton}><FA name="wrench" />Egenskaper</button>
							: ''
					}
					<WorkshopTitle />
				</section>
				<section className={styles.section}>
					<div className={styles.wave} />
					<h3 className={styles.sidebarSub}>Övningar</h3>
					<PartList />
				</section>
				<section className={styles.section}>
					<div className={styles.wave} />
					<h3 className={styles.sidebarSub}>Läs mer</h3>
					<LinkList />
				</section>
				<StatusBar />
				<button className={styles.toggleSidebarButton} onClick={this.handleSidebarClick}>
					<FA className={this.getCloseBtnClassName()} name="angle-double-left" />
				</button>
			</aside>
		)
	}
}

function mapStateToProps(state) {
	return {
		isSidebarOpen: state.sidebar.open,
		editing: state.editor.editing,
		workshop: state.workshops.item,
		chromeAppReachable: state.statusBar.chromeAppReachable,
		deviceConnected: state.statusBar.deviceConnected
	}
}

export default connect(mapStateToProps)(Sidebar)

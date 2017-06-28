import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { toggleSidebar } from '../../actions/student'

import PartList from './PartList'
import ReferenceList from './ReferenceList'
import styles from './sidebar.css'

class Sidebar extends React.Component {

	constructor () {
		super()

		this.handleSidebarClick = this.handleSidebarClick.bind(this)
		this.getSidebarClassName = this.getSidebarClassName.bind(this)
	}

	handleSidebarClick () {
		this.props.dispatch( toggleSidebar(!this.props.isSidebarOpen) )
	}


	getSidebarClassName() {
		if (this.props.isSidebarOpen) return styles.mainSidebar
		else return styles.mainSidebar + ' ' + styles.mainSidebarClosed
	}

	getCloseBtnClassName() {
		if (!this.props.isSidebarOpen) return styles.rotated
	}

	render() {
		return (
			<div className={this.getSidebarClassName()}>
				<div className="content">
					<h2>{this.props.workshop.title}</h2>
					<PartList parts={this.props.workshop.parts} />
					<hr />
					<h2>Referenslänkar</h2>
					<ReferenceList links={this.props.workshop.links} />
				</div>
				<a className={styles.closeBtn} href="#" onClick={this.handleSidebarClick}><FA className={this.getCloseBtnClassName()} name='angle-double-left'/></a>
			</div>
		)
	}
}

function mapStateToProps (state) {
	return {
		isSidebarOpen: state.sidebar.open,
		workshop: JSON.parse(state.login.currentWorkshop)
	}
}

export default connect(mapStateToProps)(Sidebar)
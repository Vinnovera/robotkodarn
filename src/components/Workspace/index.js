import React, { Component } from 'react'
import { connect } from 'react-redux'

import { findWorkshopByPin, clearWorkshop, setCurrentEditingType } from '../../actions/workshops'
import { setUserInfo } from '../../actions/user'

import Sidebar from './../Sidebar'
import Editor from './../Editor'
import Console from './../Console'
import Spinner from './../Spinner'
import View from './../View'
import FadeIn from './../FadeIn'
import ToolsButton from './../ToolsButton'
import LinkForm from './LinkForm'
import PartTitle from './PartTitle'
import WorkshopProperties from '../WorkshopProperties'

import WorkspaceButtons from './WorkspaceButtons'

import styles from './workspace.css'

export class Workspace extends Component {
	componentWillMount() {
		this.props.dispatch(setUserInfo())
		this.props.dispatch(findWorkshopByPin(this.props.params.pin))
	}
	componentWillUnmount() {
		this.props.dispatch(clearWorkshop())
		this.props.dispatch(setCurrentEditingType('part'))
	}

	getMainPaneClassName = () => {
		if (this.props.isSidebarOpen) {
			return styles.mainPane
		}

		return `${styles.mainPane} ${styles.mainPaneExpanded}`
	}

	renderCurrentEditingType() {
		if (this.props.currentEditingType === 'link') {
			return this.props.currentWorkshop.links.length > 0
				? <LinkForm />
				: <h3>Det finns inga länkar!</h3>
		} else if (this.props.currentEditingType === 'workshopProperties') {
			return <WorkshopProperties />
		}

		return this.props.currentWorkshop.parts.length > 0 ? (
			<div style={{ height: '100%' }}>
				<PartTitle />
				<WorkspaceButtons />
				<div className={styles.editorConsoleWrapper}>
					<Editor />
					<Console />
				</div>
			</div>) : <h3>Det finns inga lektioner!</h3>
	}


	renderMainContent() {
		if (this.props.currentWorkshop) {
			return (this.props.isLoggedIn && this.props.editing) ? (
				<View background="editMode">
					<ToolsButton />
					<Sidebar />

					<FadeIn>
						<main className={this.getMainPaneClassName()}>
							{ this.renderCurrentEditingType() }
						</main>
					</FadeIn>
				</View>
			) : (
				<View>
					{ this.props.isLoggedIn && <ToolsButton /> }
					<Sidebar />

					<FadeIn>
						<main className={this.getMainPaneClassName()}>
							{ this.props.currentWorkshop.parts.length > 0 && this.props.activePartIndex >= 0 ?
								<h1 className={styles.workspaceHeadline}>{this.props.currentWorkshop.parts[this.props.activePartIndex].title}</h1>
								:
								<h1 className={styles.workspaceHeadline}>Övning</h1>
							}
							<WorkspaceButtons />
							<div className={styles.editorConsoleWrapper}>
								<Editor />
								<Console />
							</div>
						</main>
					</FadeIn>
				</View>
			)
		}

		return (
			<Spinner />
		)
	}

	render() {
		return this.renderMainContent()
	}
}

function mapStateToProps(state) {
	return {
		isSidebarOpen: state.sidebar.open,
		workshopPropertiesVisible: state.sidebar.workshopPropertiesVisible,
		currentWorkshop: state.workshops.item,
		activePartIndex: state.editor.activePartIndex,
		activeLinkIndex: state.workshops.activeLinkIndex,
		editing: state.editor.editing,
		editingType: state.editor.editingType.type,
		partsToEdit: state.editor.partsToEdit,
		isLoggedIn: state.user.isLoggedIn,
		currentEditingType: state.workshops.currentEditingType
	}
}

export default connect(mapStateToProps)(Workspace)

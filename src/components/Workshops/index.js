import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

import {
	toggleEditing,
	getWorkshopsByUserId,
	createWorkshop,
	copyWorkshop,
	deleteWorkshop
} from '../../actions/workshops'

import View from '../View'
import FadeIn from '../FadeIn'
import Button from '../Button'
import ToolsButton from '../ToolsButton'
import styles from './workshops.css'

class Workshops extends Component {
	componentWillMount() {
		this.props.dispatch(getWorkshopsByUserId())
	}

	handleWorkshop = (event) => {
		event.preventDefault()
		const { value, name } = event.currentTarget

		if (name === 'copy') {
			this.props.dispatch(copyWorkshop(value))
		} else if (name === 'delete') {
			this.props.dispatch(deleteWorkshop(value))
		}
	}

	startEditing = () => {
		if (!this.props.editing) {
			this.props.dispatch(toggleEditing())
		}
	}

	handleCreateNew = (event) => {
		event.preventDefault()
		this.props.dispatch(createWorkshop())
	}

	render() {
		const workshops = this.props.userWorkshops
		return (
			<View background="red">
				{ this.props.isLoggedIn && <header className={styles.header}><h1 className={styles.headerTitle}>Robotkodarn</h1><ToolsButton /></header> }
				<FadeIn>
					<div className={styles.workshops}>
						<h1 className={styles.workshopHeadline}>Mina workshops</h1>
						<form className={styles.form} method="post">
							{ workshops.length > 0 ?
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
										{workshops.map((workshop) => {
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
										}
										)}
									</tbody>
								</table>
								:
								<p className={styles.info}>Du har inte skapat några workshops än.</p>
							}
							<div className={styles.buttonContainer}>
								<Button kind="success" handleClick={this.handleCreateNew}>Lägg till ny</Button>
							</div>
						</form>
					</div>
				</FadeIn>
			</View>
		)
	}
}

function mapStateToProps(state) {
	return {
		userWorkshops: state.workshops.userWorkshops,
		role: state.user.isLoggedIn,
		editing: state.editor.editing,
		isLoggedIn: state.user.isLoggedIn
	}
}

export default connect(mapStateToProps)(Workshops)

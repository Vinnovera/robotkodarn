import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import FadeIn from '../FadeIn'
import styles from './notfound.css'

const NotFound = ({ isLoggedIn }) => {
	return (
		<div className={styles.background}>
			<FadeIn>
				<div className={styles.notfound}>
					<h1 className={styles.headline}>Sidan du försöker nå finns inte</h1>
					<ul className={styles.linksuggestions}>
						<li>
							<Link href="/login" className={styles.link}>Gå till en workshop</Link>
						</li>
						{ isLoggedIn ? (
							<li>
								<Link href="/workshops" className={styles.link}>Gå till lektionsöversikten</Link>
							</li>
						) : '' }
					</ul>
				</div>
			</FadeIn>
		</div>
	)
}

NotFound.PropTypes = {
	isLoggedIn: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.user.isLoggedIn
	}
}

export default connect(mapStateToProps)(NotFound)

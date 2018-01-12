import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleMenu } from '../../actions/menu'

/**
 * Component that alerts if you click outside of it.
 * Used to close menu if user clicks outside when menu
 * is open.
 */
class OutsideAlerter extends Component {
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside)
	}

	/**
	 * Set the wrapper ref
	 */
	setWrapperRef = (node) => {
		this.wrapperRef = node
	}

	/**
	 * Close menu if user clicks outside.
	 */
	handleClickOutside = (event) => {
		if (!this.props.open) {
			return
		}

		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.props.dispatch(toggleMenu())
		}
	}

	render() {
		return (
			<div ref={this.setWrapperRef}>
				{this.props.children}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		open: state.menu.open
	}
}

export default connect(mapStateToProps)(OutsideAlerter)

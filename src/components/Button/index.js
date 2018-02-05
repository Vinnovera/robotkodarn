import React from 'react'
import styles from './button.css'

const Button = ({ children, handleClick, kind = 'normal', disabled = false }) => {
	let buttonStyle = styles.button

	if (kind === 'danger') {
		buttonStyle = styles.buttonDanger
	} else if (kind === 'success') {
		buttonStyle = styles.buttonSuccess
	} else if (kind === 'disabled') {
		buttonStyle = styles.buttonDisabled
	}

	return (
		<button disabled={disabled} onClick={handleClick} className={buttonStyle}>{children}</button>
	)
}

export default Button

import React from 'react'
import FA from 'react-fontawesome'

import styles from './spinnercog.css'

const SpinnerCog = ({ ...style, fontSize = '1rem', animationDuration = '4s' }) => {
	return (<FA
		style={{
			...style.style,
			fontSize: fontSize,
			animationDuration: animationDuration
		}}
		className={styles.cog}
		name="cog"
	/>)
}

export default SpinnerCog

import React from 'react'
import styles from './spinner.css'

/**
 * A spinner to be used when loading.
 * Original source: https://github.com/tobiasahlin/SpinKit
 */
const Spinner = () => {
	return (
		<div className={styles.center}>
			<div className={styles.skFoldingCube}>
				<div className={styles.skCube1} />
				<div className={styles.skCube2} />
				<div className={styles.skCube4} />
				<div className={styles.skCube3} />
			</div>
		</div>
	)
}

export default Spinner

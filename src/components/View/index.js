import React from 'react'

import styles from './view.css'

const View = ({ children, background = 'beige' }) => {
	let componentStyle

	switch (background) {
	case 'beige': componentStyle = styles.beigeView; break
	case 'red': componentStyle = styles.redView; break
	case 'green': componentStyle = styles.greenView; break
	case 'editMode': componentStyle = styles.editView; break
	case 'listWorkshopsView': componentStyle = styles.listWorkshopsView; break

	default: componentStyle = styles.beigeView; break
	}

	return (
		<div className={componentStyle}>
			{ children }
		</div>
	)
}

export default View

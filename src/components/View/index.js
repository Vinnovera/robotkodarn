import React from 'react'

import styles from './view.css'

const View = ({ children, background = 'beige' }) => {
  let componentStyle

  if (background === 'beige') {
    componentStyle = styles.beigeView
  } else if (background === 'red') {
    componentStyle = styles.redView
  } else if (background === 'green') {
    componentStyle = styles.greenView
  } else if (background === 'editMode') {
    componentStyle = styles.editView
  }

  return (
    <div className={componentStyle}>
      { children }
    </div>
  )
}

export default View

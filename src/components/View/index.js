import React from 'react'
import ToolsButton from './../ToolsButton'
import Menu from './../Menu'
import styles from './view.css'

const View = ({ children, background = 'beige' }) => {
  let componentStyle

  if (background === 'beige') {
    componentStyle = styles.beigeView
  } else if (background === 'red') {
    componentStyle = styles.redView
  } else if (background === 'green') {
    componentStyle = styles.greenView
  }

  return (
    <div className={componentStyle}>
      { children }
    </div>
  )
}

export default View

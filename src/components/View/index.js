import React from 'react'
import Navbar from './../Navbar'
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
      <Navbar />
      { children }
    </div>
  )
}

export default View

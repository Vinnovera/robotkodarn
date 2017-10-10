import React from 'react'
import styles from './fadein.css'

const FadeIn = ({ children }) => {
  return (
    <div className={styles.fadeIn}>
      { children }
    </div>
  )
}

export default (FadeIn)

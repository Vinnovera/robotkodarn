import React from 'react'
import styles from './button.css'

const Button = ({ children, handleClick, kind = 'normal' }) => {
  let buttonStyle = styles.button

  if (kind === 'danger') {
    buttonStyle = styles.buttonDanger
  } else if (kind === 'success') {
    buttonStyle = styles.buttonSuccess
  }

  return (
    <button onClick={handleClick} className={buttonStyle}>{children}</button>
  )
}

export default Button

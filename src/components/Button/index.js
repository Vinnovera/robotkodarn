import React from 'react'
import styles from './button.css'

const Button = ({ children, handleClick, type = 'normal' }) => {
  let buttonStyle = styles.button

  if (type === 'danger') {
    buttonStyle = styles.buttonDanger
  } else if (type === 'success') {
    buttonStyle = styles.buttonSuccess
  }

  return (
    <button onClick={handleClick} className={buttonStyle}>{children}</button>
  )
}

export default Button

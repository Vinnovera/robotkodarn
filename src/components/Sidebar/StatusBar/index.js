import React from 'react'
import { connect } from 'react-redux'

import styles from './statusbar.css'

const StatusBar = (props) => {  
  return (
    <section className={styles.status}>
      <div><span><i className={`${styles.connectionDot} ${props.chromeAppReachable ? styles.green : styles.red}`} /> Chrome-app</span></div>
      <div><span className={!props.chromeAppReachable ? styles.unreachableText : null}><i className={`${styles.connectionDot} ${props.chromeAppReachable ? (props.deviceConnected ? styles.green : styles.red) : styles.unreachable}`} /> Robot</span></div>
    </section>
  )
}

function mapStateToProps(state) {
  return {
    chromeAppReachable: state.statusBar.chromeAppReachable,
    deviceConnected: state.statusBar.deviceConnected
  }
}

export default connect(mapStateToProps)(StatusBar)

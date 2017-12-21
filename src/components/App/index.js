import React from 'react'
import { connect } from 'react-redux'

const App = ({ ...props }) => <div>{ props.children }</div>

export default connect()(App)

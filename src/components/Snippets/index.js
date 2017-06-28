import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Navbar from './../Navbar'
import Sidebar from './../Sidebar'
import Editor from './../Editor'
import Console from './../Console'
import ActionButtons from './../ActionButtons'

import styles from './snippets.css'

//This component is not used but will hopefully be developed some time soon...

export class Snippets extends Component {
	constructor (props) {
		super(props)
	}

	render () {
		return (
            <div className={styles.snippetsWrapper}>
                <a href="#" className="button xs primary">Snippet 1</a>
                <a href="#" className="button xs success">Snippet 2</a>
                <a href="#" className="button xs info">Snippet 3</a>
                <a href="#" className="button xs warning">Snippet 4</a>
                <a href="#" className="button xs danger">Snippet 5</a>
            </div>
		)
	}
}

export default connect()(Snippets)

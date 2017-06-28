import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'

import FA from 'react-fontawesome'

import 'brace/mode/c_cpp'
import brace from 'brace';
import 'brace/theme/textmate'

import { changeEditorTab, updateCode, uploadCode, setConsoleOutput } from '../../actions/editor'
import { setCurrentParts } from '../../actions/student'

import styles from './editor.css'

export class Editor extends Component {
	constructor (props) {
		super(props)

		this.handleTabClick = this.handleTabClick.bind(this)
        this.onChange = this.onChange.bind(this)

        // we use local state to force react to update DOM by itself more easily when changed
        this.state = {
            workshop: null,
            currentParts: null
        }
	}

    componentWillReceiveProps(nextProps) {
        let msg;

        if(nextProps.compilerResponse !== this.props.compilerResponse) {

            if(!nextProps.compilerResponse.response.error && nextProps.willUpload) {

                msg = {
					type: 'success',
					heading: 'Kompilering klar',
					message: 'Laddar upp till robot...'
				}
                this.props.dispatch( setConsoleOutput(msg) )

                this.props.dispatch( uploadCode(nextProps.compilerResponse.response) )

            // "Testa min kod" without errors
            } else if(!nextProps.compilerResponse.response.error && !nextProps.willUpload) {
                msg = {
					type: 'success',
					heading: 'Kompilering klar',
					message: 'Din kod ser bra ut!'
				}
                this.props.dispatch( setConsoleOutput(msg) )
            }            
        }

        // When currentParts has gone changed
        if(this.props.currentParts !== nextProps.currentParts) {
            this.setState({
                currentParts: nextProps.currentParts
            })
        }
    }

    componentWillMount() {
        this.setState({
            workshop: this.props.workshop
        })
    }

	handleTabClick(userOrOriginal) {
		this.props.dispatch( changeEditorTab(userOrOriginal) )
	}

    onChange(newValue) {
        let copyOfParts = this.state.currentParts
        copyOfParts[this.props.activePartIndex].code = newValue
        this.setState({
            currentParts: copyOfParts
        })
        
        this.props.dispatch( setCurrentParts(copyOfParts) )

        // saving code to localStorage on every new key stroke
        // at the time it never loads anything from localStorage so this function
        // is kind of useless atm...        
        this.saveToLocalStorage()
    }

    saveToLocalStorage() {
        localStorage.setItem( 'code', JSON.stringify(this.state.currentParts) )
    }

	renderTab() {
        if (this.props.activeTab === 'user')
            return <AceEditor
                    ref="editor"
                    setOptions={{
                        readOnly: false
                    }}
                    theme="textmate"
                    fontSize='16px'
                    mode='c_cpp'
                    onChange={this.onChange}
                    name='codeEditor'
                    width='auto'
                    height='90%'
                    editorProps={{$blockScrolling: true}}
                    value={this.state.currentParts[this.props.activePartIndex].code || 'Laddar...'}
                    showPrintMargin={false} />
        else
            return <AceEditor
                    setOptions={{
                        readOnly: true
                    }}
                    theme="textmate"
                    fontSize='16px'
                    mode='c_cpp'
                    name='codeEditor'
                    width='auto'
                    height='90%'
                    editorProps={{$blockScrolling: true}}
                    value={this.state.workshop.parts[this.props.activePartIndex].code}
                    showPrintMargin={false} />
    }

    renderControlPanelIfUser() {
        if(this.props.activeTab === 'user') {
            return (
                <div>
                    <button className={styles.undo} onClick={()=> {this.refs.editor.editor.undo()}}><FA name='undo' /></button>
                    <button className={styles.redo} onClick={()=> {this.refs.editor.editor.redo()}}><FA name='repeat' /></button>
                </div>
            )
        }
    }

	render () {
        if(this.state.currentParts) { 
            return (
                <div className={styles.codeWrapper}>
                    {this.renderControlPanelIfUser()}

                    <ul>
                        <li onClick={() => this.handleTabClick('user')} className={this.props.activeTab === 'user' && styles.active}><a href='#'>Din kod</a></li>
                        <li onClick={() => this.handleTabClick('original')} className={this.props.activeTab === 'original' && styles.active}><a href='#'>Original</a></li>
                    </ul>
                    {this.renderTab()}
                </div>
            )
        } else return <h1>Laddar...</h1>
	}
}

function mapStateToProps (state) {
	return {
		activeTab: state.editor.activeTab,
        compilerResponse: state.editor.compilerResponse,
        willUpload: state.editor.willUpload,
        activePartIndex: state.editor.activePartIndex,
        currentParts: state.student.currentParts,
        workshop: JSON.parse(state.login.currentWorkshop)
	}
}

export default connect(mapStateToProps)(Editor)
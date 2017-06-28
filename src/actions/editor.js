
// ----------------------------------------
// changeEditorTab, sets state to pressed tab
// ----------------------------------------
export const changeEditorTab = (userOrOriginal) => (dispatch) => {
	dispatch({
		type: 'SET_EDITOR_TAB',
		payload: userOrOriginal
	})
}

// ----------------------------------------
// compileCode, sends code to compiler
// ----------------------------------------
export const compileCode = (codeToCompile, willUpload) => (dispatch) => {
	
	const request = new XMLHttpRequest()
	request.open('POST', '/api/editor', true)
	request.setRequestHeader('Content-Type', 'application/json')

	request.onload = () => {
		if (request.status >= 200 && request.status < 400) {
	        dispatch({
	            type: 'SET_COMPILER_RESPONSE',
	            payload: {
					compilerResponse: {
						response: request.response,
						timestamp: +new Date
					},
					willUpload: willUpload,
				}
	        })
		} else {
			 dispatch({
	            type: 'SET_COMPILER_RESPONSE',
	            payload: {
					compilerResponse: {
						response: JSON.parse(request.response),
						timestamp: +new Date
					},
					willUpload: willUpload,
				}
	        })
		}
	}
	request.send( JSON.stringify(codeToCompile) )
}

// ----------------------------------------
// uploadCode, uploads compiled code to Arduino unit
// ----------------------------------------
export const uploadCode = (compiledCode) => (dispatch) => {
	const request = new XMLHttpRequest()
	request.open('POST', '/api/usb', true)
	request.setRequestHeader('Content-Type', 'application/json')

	request.onload = () => {
		console.log( request )
		if (request.status >= 200 && request.status < 400) {
            dispatch({
                type: 'SET_CONSOLE_OUTPUT',
                payload: {
					type: 'success',
					heading: 'Lyckat',
					message: 'Kod uppladdad till robot'
				}
            })
		} else {
			dispatch({
                type: 'SET_CONSOLE_OUTPUT',
                payload: {
					type: 'error',
					heading: 'Fel från kompilator',
					message: JSON.parse(request.response).error
				}
            })
		}
	}
	request.send( JSON.stringify(compiledCode) )
}

// ----------------------------------------
// setConsoleOutput, sets output message shown in console
// ----------------------------------------
export const setConsoleOutput = (output) => (dispatch) => {
	dispatch({
		type: 'SET_CONSOLE_OUTPUT',
		payload: { type: output.type, heading: output.heading, message: output.message }
	})
}

// ----------------------------------------
// clearConsole, clears console
// ----------------------------------------
export const clearConsole = () => (dispatch) => {
	dispatch({
		type: 'CLEAR_CONSOLE'
	})
}

// ----------------------------------------
// pingForUSBConnection, watches computer connection ports
// ----------------------------------------
export const pingForUSBConnection = () => (dispatch) => {
	const request = new XMLHttpRequest()
	request.open('GET', '/api/usb', true)
	request.setRequestHeader('Content-Type', 'application/json')

	request.onload = () => {
		if (request.status >= 200 && request.status < 400) {
			dispatch({
				type: 'SET_CONNECTED_ROBOT',
				payload: request.response
			})
		} else {
			dispatch({
				type: 'SET_CONNECTED_ROBOT',
				payload: null
			})
		}
	}
	request.send()
}

// ----------------------------------------
// setActivePartIndex, sets clicked part to state
// ----------------------------------------
export const setActivePartIndex = (index) => (dispatch) => {
	dispatch({
		type: 'SET_ACTIVE_PART_INDEX',
		payload: index
	})
}
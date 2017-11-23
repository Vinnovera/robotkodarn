const CLEAR_CONSOLE = 'CLEAR_CONSOLE'
const SET_EDITOR_TAB = 'SET_EDITOR_TAB'
const SET_ACTIVE_PART_INDEX = 'SET_ACTIVE_PART_INDEX'
const SET_COMPILER_RESPONSE = 'SET_COMPILER_RESPONSE'
const SET_CONSOLE_OUTPUT = 'SET_CONSOLE_OUTPUT'
const TOGGLE_EDITING = 'TOGGLE_EDITING'
const SET_EDITING_TYPE = 'SET_EDITING_TYPE'
const SET_PARTS_TO_EDIT = 'SET_PARTS_TO_EDIT'
const TOGGLE_CODE_BUTTONS = 'TOGGLE_CODE_BUTTONS'
const SET_CHROME_PING = 'SET_CHROME_PING'
const SET_DEVICE_CONNECTED = 'SET_DEVICE_CONNECTED'
const TOGGLE_COMPILER_BUTTON_ANIMATION = 'TOGGLE_COMPILER_BUTTON_ANIMATION'
const TOGGLE_UPLOAD_BUTTON_ANIMATION = 'TOGGLE_UPLOAD_BUTTON_ANIMATION'

// -----------------------------------------------------------------------------
// setPartsToEdit, Sets the parts that user can edit in editor
// -----------------------------------------------------------------------------
export const setPartsToEdit = parts => (dispatch) => {
  dispatch({
    type: SET_PARTS_TO_EDIT,
    payload: parts
  })
}

// -----------------------------------------------------------------------------
// changeEditorTab, sets state to pressed tab
// -----------------------------------------------------------------------------
export const changeEditorTab = userOrOriginal => (dispatch) => {
  dispatch({
    type: SET_EDITOR_TAB,
    payload: userOrOriginal
  })
}
// -----------------------------------------------------------------------------
// toggleEditing, used if editor/superadmin is logged in and wants
// to start editing currentWorkshop
// -----------------------------------------------------------------------------

export const toggleEditing = () => (dispatch) => {
  dispatch({
    type: TOGGLE_EDITING
  })
}

// -----------------------------------------------------------------------------
// compileCode, sends code to compiler
// -----------------------------------------------------------------------------
export const compileCode = (codeToCompile, willUpload) => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('POST', '/api/editor', true)
  request.setRequestHeader('Content-Type', 'application/json')

  request.onload = () => {
    if (request.status === 200) {
      dispatch({
        type: SET_COMPILER_RESPONSE,
        payload: {
          compilerResponse: {
            response: request.response,
            timestamp: +new Date()
          },
          willUpload
        }
      })
    } else if (request.status === 400) {
      dispatch({
        type: SET_COMPILER_RESPONSE,
        payload: {
          compilerResponse: {
            response: JSON.parse(request.response),
            timestamp: +new Date()
          },
          willUpload: false
        }
      })
    }
  }
  request.send(JSON.stringify(codeToCompile))
}

// -----------------------------------------------------------------------------
// uploadCode – Uploads compiled code via Chrome App to Arduino unit.
// -----------------------------------------------------------------------------

/**
 * Takes the compiled code and sends it to Robotkodarn Chrome App,
 * which takes care of the uploading code (app is based on avrgirl).
 * The Chrome App ID is retrieved from server.
 *
 * @param {string} compiledCode The code compiled through avrpizza
 */
export const uploadCode = compiledCode => (dispatch) => {
  /* If error occurs during compilation,
   * exit early and inform user.
   */
  if (compiledCode.error) {
    dispatch({
      type: SET_CONSOLE_OUTPUT,
      payload: {
        type: 'error',
        heading: 'Fel vid kompilering',
        message: 'Hhhmm, något ser inte rätt ut i koden.'
      }
    })
    return
  }

  // Robotkodarn's Chrome App ID
  const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID
  const port = chrome.runtime.connect(CHROME_EXTENSION_ID)

  // Payload to be sent to Chrome App
  const message = {
    board: 'uno', // Hardcoded 'uno' for testing purposes
    file: compiledCode
  }

  // Give user feedback when recieving message from Chrome App
  port.onMessage.addListener((uploadMessage) => {
    if (uploadMessage.success) {
      dispatch({
        type: 'SET_CONSOLE_OUTPUT',
        payload: {
          type: 'success',
          heading: 'Lyckad uppladdning',
          message: 'Bra jobbat, du har nu laddat upp koden till din robot.'
        }
      })
    } else {
      dispatch({
        type: 'SET_CONSOLE_OUTPUT',
        payload: {
          type: 'error',
          heading: 'Fel vid uppladdningen',
          // Inform user if no robot is connected.
          message: uploadMessage.error.includes('no Arduino') ?
            'Du har inte kopplat in någon robot.' :
            uploadMessage.error // FYI: will be in English
        }
      })
    }

    dispatch({
      type: 'TOGGLE_CODE_BUTTONS',
      payload: true
    })

    dispatch({
      type: 'TOGGLE_UPLOAD_BUTTON_ANIMATION',
      payload: false
    })
  })

  // Send message to Chrome App
  port.postMessage(message)
}

// -----------------------------------------------------------------------------
// setConsoleOutput
// -----------------------------------------------------------------------------
/**
 * Sets output message shown in console. Takes an object with three props.
 * Type can be:
 *
 * 1. Info (blue heading)
 * 2. Success (green heading)
 * 3. Warning (red heading)
 *
 * If no type provided, heading will be black.
 */
export const setConsoleOutput = output => (dispatch) => {
  dispatch({
    type: SET_CONSOLE_OUTPUT,
    payload: {
      type: output.type,
      heading: output.heading,
      message: output.message
    }
  })
}

// -----------------------------------------------------------------------------
// clearConsole, clears console
// -----------------------------------------------------------------------------
export const clearConsole = () => (dispatch) => {
  dispatch({
    type: CLEAR_CONSOLE
  })
}

// -----------------------------------------------------------------------------
// setActivePartIndex, sets clicked part to state
// -----------------------------------------------------------------------------
export const setActivePartIndex = index => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_PART_INDEX,
    payload: index
  })
}

// -----------------------------------------------------------------------------
// setEditingType, sets the type of content to be edited.
// If ID is provided, part/link is to be be updated.
// Else: create new.
// -----------------------------------------------------------------------------
export const setEditingType = (type, id = null) => (dispatch) => {
  dispatch({
    type: SET_EDITING_TYPE,
    payload: {
      type,
      id
    }
  })
}

// -----------------------------------------------------------------------------
// toggleCodeButtons, disables or enables the compile and upload buttons
// -----------------------------------------------------------------------------
export const toggleCodeButtons = toggleValue => (dispatch) => {
  dispatch({
    type: TOGGLE_CODE_BUTTONS,
    payload: toggleValue
  })
}

// -----------------------------------------------------------------------------
// pingChromeApp, pings the Chrome App expecting a response "pong"
// -----------------------------------------------------------------------------
export const pingChromeApp = () => (dispatch) => {
  chrome.runtime.sendMessage(process.env.CHROME_EXTENSION_ID, { message: 'ping' }, (reply) => {
    dispatch({
      type: SET_CHROME_PING,
      payload: (reply && reply.response === 'pong')
    })
  })
}

// -----------------------------------------------------------------------------
// pingForUSBConnection, pings the Chrome App that retrieves a list of
// arduino devices that are connected
// -----------------------------------------------------------------------------
export const pingForUSBConnection = () => (dispatch) => {
  chrome.runtime.sendMessage(process.env.CHROME_EXTENSION_ID, { message: 'list' }, (reply) => {
    if (!reply || reply.error) {
      console.error('Ingen kontakt med Chrome App eller fel vid hämtning av lista')
    } else {
      const deviceConnected = reply.ports.filter(port => port.manufacturer !== undefined).length > 0

      dispatch({
        type: SET_DEVICE_CONNECTED,
        payload: deviceConnected
      })
    }
  })
}

// -----------------------------------------------------------------------------
// animateCompilebutton, turn the animation for compiler button on or off
// -----------------------------------------------------------------------------
export const animateCompileButton = toggleValue => (dispatch) => {
  dispatch({
    type: TOGGLE_COMPILER_BUTTON_ANIMATION,
    payload: toggleValue
  })
}


// -----------------------------------------------------------------------------
// animateUploadbutton, turn the animation for upload button on or off
// -----------------------------------------------------------------------------
export const animateUploadButton = toggleValue => (dispatch) => {
  dispatch({
    type: TOGGLE_UPLOAD_BUTTON_ANIMATION,
    payload: toggleValue
  })
}

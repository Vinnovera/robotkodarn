const CLEAR_CONSOLE = 'CLEAR_CONSOLE'
const SET_EDITOR_TAB = 'SET_EDITOR_TAB'
const SET_ACTIVE_PART_INDEX = 'SET_ACTIVE_PART_INDEX'
const SET_COMPILER_RESPONSE = 'SET_COMPILER_RESPONSE'
const SET_CONSOLE_OUTPUT = 'SET_CONSOLE_OUTPUT'

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
// compileCode, sends code to compiler
// -----------------------------------------------------------------------------
export const compileCode = (codeToCompile, willUpload) => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('POST', '/api/editor', true)
  request.setRequestHeader('Content-Type', 'application/json')

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
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
    } else {
      dispatch({
        type: SET_COMPILER_RESPONSE,
        payload: {
          compilerResponse: {
            response: JSON.parse(request.response),
            timestamp: +new Date()
          },
          willUpload
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
  if (compiledCode.compileError) {
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

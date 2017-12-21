import { connectPort } from '../utils/chromeapp'
import { serialListen } from './serial'

const TOGGLE_COMPILER_BUTTON_ANIMATION = 'TOGGLE_COMPILER_BUTTON_ANIMATION'
const TOGGLE_UPLOAD_BUTTON_ANIMATION = 'TOGGLE_UPLOAD_BUTTON_ANIMATION'
const TOGGLE_CODE_BUTTONS = 'TOGGLE_CODE_BUTTONS'
const SET_COMPILER_RESPONSE = 'SET_COMPILER_RESPONSE'
const SET_CONSOLE_OUTPUT = 'SET_CONSOLE_OUTPUT'

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

  const port = connectPort()

  // Payload to be sent to Chrome App
  const message = {
    type: 'flash',
    board: 'uno', // Hardcoded 'uno' for testing purposes
    file: compiledCode
  }

  // Give user feedback when recieving message from Chrome App
  port.onMessage.addListener((uploadMessage) => {
    if (uploadMessage.success) {
      dispatch({
        type: SET_CONSOLE_OUTPUT,
        payload: {
          type: 'success',
          heading: 'Lyckad uppladdning',
          message: 'Bra jobbat, du har nu laddat upp koden till din robot.'
        }
      })

      dispatch(serialListen())
    } else {
      dispatch({
        type: SET_CONSOLE_OUTPUT,
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
      type: TOGGLE_CODE_BUTTONS,
      payload: true
    })

    dispatch({
      type: TOGGLE_UPLOAD_BUTTON_ANIMATION,
      payload: false
    })
  })

  // Send message to Chrome App
  port.postMessage(message)
}

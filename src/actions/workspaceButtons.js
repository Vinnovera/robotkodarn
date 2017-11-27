const TOGGLE_COMPILER_BUTTON_ANIMATION = 'TOGGLE_COMPILER_BUTTON_ANIMATION'
const TOGGLE_UPLOAD_BUTTON_ANIMATION = 'TOGGLE_UPLOAD_BUTTON_ANIMATION'
const TOGGLE_CODE_BUTTONS = 'TOGGLE_CODE_BUTTONS'

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
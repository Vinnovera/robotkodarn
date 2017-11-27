import { handleActions } from 'redux-actions'

export default handleActions({
  TOGGLE_CODE_BUTTONS: (state, action) => {
    return ({
      ...state,
      enabledButtons: action.payload
    })
  },

  TOGGLE_COMPILER_BUTTON_ANIMATION: (state, action) => {
    return ({
      ...state,
      animatedCompileButton: action.payload
    })
  },

  TOGGLE_UPLOAD_BUTTON_ANIMATION: (state, action) => {
    return ({
      ...state,
      animatedUploadButton: action.payload
    })
  }

}, {
  enabledButtons: true,
  animatedCompileButton: false,
  animatedUploadButton: false
})

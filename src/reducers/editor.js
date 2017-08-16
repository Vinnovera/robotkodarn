import { handleActions } from 'redux-actions'

export default handleActions({
  SET_EDITOR_TAB: (state, action) => {
    return ({
      ...state,
      activeTab: action.payload
    })
  },

  UPDATE_CODE: (state, action) => {
    return ({
      ...state,
      updatedCode: action.payload
    })
  },

  SET_COMPILER_RESPONSE: (state, action) => {
    return ({
      ...state,
      compilerResponse: action.payload.compilerResponse,
      willUpload: action.payload.willUpload
    })
  },

  SET_CONSOLE_OUTPUT: (state, action) => {
    const consoleMessage = {
      key: +new Date(),
      timestamp: new Date(),
      type: action.payload.type,
      heading: action.payload.heading,
      message: action.payload.message
    }

    return ({
      ...state,
      consoleOutput: [...state.consoleOutput, consoleMessage]
    })
  },

  CLEAR_CONSOLE: (state, action) => {
    return ({
      ...state,
      consoleOutput: []
    })
  },

  SET_CONNECTED_ROBOT: (state, action) => {
    return ({
      ...state,
      connectedArduino: action.payload
    })
  },

  SET_ACTIVE_PART_INDEX: (state, action) => {
    return ({
      ...state,
      activePartIndex: action.payload
    })
  }
}, {
  activeTab: 'user',
  compilerResponse: null,
  consoleOutput: [],
  connectedArduino: null,
  activePartIndex: 0
})

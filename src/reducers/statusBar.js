import { handleActions } from 'redux-actions'

export default handleActions({
  SET_CHROME_PING: (state, action) => {
    return ({
      ...state,
      chromeAppReachable: action.payload
    })
  },

  SET_DEVICE_CONNECTED: (state, action) => {
    return ({
      ...state,
      deviceConnected: action.payload
    })
  }

}, {
  chromeAppReachable: false,
  deviceConnected: false
})

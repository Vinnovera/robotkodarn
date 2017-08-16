import { handleActions } from 'redux-actions'

export default handleActions({
  IS_LOGGED_IN: (state, action) => {
    return ({
      ...state,
      loggedInUser: action.payload
    })
  }
}, {
  loggedInUser: null
})

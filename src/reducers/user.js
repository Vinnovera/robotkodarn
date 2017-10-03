import { handleActions } from 'redux-actions'

export default handleActions({
  IS_AUHTORIZED: (state, action) => {
    return ({
      ...state,
      loggedInUser: action.payload
    })
  }
}, {
  loggedInUser: null
})

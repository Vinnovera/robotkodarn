import { handleActions } from 'redux-actions'

export default handleActions({
  SET_WORKSHOP: (state, action) => {
    return ({
      ...state,
      currentWorkshop: action.payload,
      loginAttemptTimestamp: +new Date()
    })
  }
}, {
  currentWorkshop: null,
  loginAttemptTimestamp: +new Date()
})

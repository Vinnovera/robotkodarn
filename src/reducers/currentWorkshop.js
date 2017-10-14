import { handleActions } from 'redux-actions'

export default handleActions({
  SET_WORKSHOP_BY_PIN: (state, action) => {
    return ({
      ...state,
      item: action.payload,
      loginAttemptTimestamp: +new Date()
    })
  }
}, {
  item: null,
  loginAttemptTimestamp: +new Date()
})

import { handleActions } from 'redux-actions'

export default handleActions({
  IS_AUHTORIZED: (state, action) => {
    return ({
      ...state,
      isLoggedIn: action.payload.isLoggedIn,
      role: action.payload.role,
      name: action.payload.name
    })
  }
}, {
  isLoggedIn: false
})

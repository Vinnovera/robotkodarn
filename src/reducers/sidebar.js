import { handleActions } from 'redux-actions'

export default handleActions({
  TOGGLE_SIDEBAR: (state, action) => {
    return ({
      ...state,
      open: action.payload
    })
  }
}, {
  open: true
})

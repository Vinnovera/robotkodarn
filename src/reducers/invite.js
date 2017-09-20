import { handleActions } from 'redux-actions'

export default handleActions({
  ADD_INVITE_ID: (state, action) => {
    return ({
      ...state,
      items: action.payload
    })
  }
}, {
  items: []
})

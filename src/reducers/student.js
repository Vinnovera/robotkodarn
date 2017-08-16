import { handleActions } from 'redux-actions'

export default handleActions({
  SET_CURRENT_PARTS: (state, action) => {
    return ({
      ...state,
      currentParts: action.payload
    })
  }
}, {
  currentParts: [],
})

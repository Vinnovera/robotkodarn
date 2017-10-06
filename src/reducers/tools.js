import { handleActions } from 'redux-actions'

export default handleActions({
  TOGGLE_TOOLS: (state) => {
    return ({
      open: !state.open
    })
  }
}, {
  open: false
})

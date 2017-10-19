import { handleActions } from 'redux-actions'

export default handleActions({
  TOGGLE_MENU: (state) => {
    return ({
      open: !state.open
    })
  }
}, {
  open: false
})

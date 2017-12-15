import { handleActions } from 'redux-actions'

export default handleActions({
  SET_SERIAL_MESSAGE: (state, action) => {
    // The message includes linebreaks '\n' 
    return ({
      ...state,
      messages: state.messages + action.payload
    })
  }

}, {
  messages: ''
})

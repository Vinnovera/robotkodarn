import { handleActions } from 'redux-actions'

export default handleActions({
  SET_USER_WORKSHOPS: (state, action) => {
    return ({
      ...state,
      userWorkshops: action.payload
    })
  },

  SET_PARTS: (state, action) => {
    return ({
      ...state,
      workshopParts: action.payload
    })
  },

  SET_MESSAGE: (state, action) => {
    return ({
      ...state,
      message: action.payload
    })
  }

}, {
  userWorkshops: [],
  message: null
})

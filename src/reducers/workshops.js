import { handleActions } from 'redux-actions'

export default handleActions({
  SET_USER_WORKSHOPS: (state, action) => {
    return ({
      ...state,
      userWorkshops: action.payload
    })
  },

  ADD_USER_WORKSHOP: (state, action) => {
    return ({
      ...state,
      userWorkshops: [...state.userWorkshops, action.payload]
    })
  },

  REMOVE_USER_WORKSHOP: (state, action) => {
    return ({
      ...state,
      userWorkshops: state.userWorkshops.filter((workshop) => {
        return workshop._id !== action.payload
      })
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

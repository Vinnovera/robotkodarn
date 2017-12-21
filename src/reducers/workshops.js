import { handleActions } from 'redux-actions'

export default handleActions({
  SET_WORKSHOP_BY_PIN: (state, action) => {
    return ({
      ...state,
      item: action.payload,
      loginAttemptTimestamp: +new Date()
    })
  },

  UPDATE_TIMESTAMP: (state, action) => {
    return ({
      ...state,
      loginAttemptTimestamp: action.payload
    })
  },

  SET_WORKSHOPS: (state, action) => {
    return ({
      ...state,
      userWorkshops: action.payload
    })
  },

  ADD_WORKSHOP: (state, action) => {
    return ({
      ...state,
      userWorkshops: [...state.userWorkshops, action.payload]
    })
  },

  REMOVE_WORKSHOP: (state, action) => {
    return ({
      ...state,
      userWorkshops: state.userWorkshops.filter((workshop) => {
        return workshop._id !== action.payload
      })
    })
  },

  UPDATE_WORKSHOP_TITLE: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        title: action.payload
      }
    })
  },

  SET_CURRENT_EDITING_TYPE: (state, action) => {
    return ({
      ...state,
      currentEditingType: action.payload
    })
  }

}, {
  userWorkshops: [],
  item: null,
  currentEditingType: 'part',
  loginAttemptTimestamp: +new Date()
})

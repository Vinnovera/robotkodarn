import { handleActions } from 'redux-actions'

export default handleActions({
  SET_WORKSHOP_BY_PIN: (state, action) => {
    return ({
      ...state,
      item: action.payload,
      loginAttemptTimestamp: +new Date()
    })
  },

  UPDATE_TITLE: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        title: action.payload
      }
    })
  },

  ADD_PART: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...state.item.parts, action.payload]
      }
    })
  },

  REMOVE_PART: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...action.payload]
      }
    })
  },

  ADD_LINK: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: [...state.item.links, action.payload]
      }
    })
  },

  REMOVE_LINK: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: [...action.payload]
      }
    })
  }
}, {
  item: null,
  loginAttemptTimestamp: +new Date()
})

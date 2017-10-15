import { handleActions } from 'redux-actions'

export default handleActions({
  SET_WORKSHOP_BY_PIN: (state, action) => {
    return ({
      ...state,
      item: action.payload,
      loginAttemptTimestamp: +new Date()
    })
  },

  ADD_PART_TO_WORKSHOP: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...state.item.parts, action.payload]
      }
    })
  },

  ADD_LINK_TO_WORKSHOP: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: [...state.item.links, action.payload]
      }
    })
  }
}, {
  item: null,
  loginAttemptTimestamp: +new Date()
})

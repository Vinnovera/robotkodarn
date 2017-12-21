import { handleActions } from 'redux-actions'

export default handleActions({
  UPDATE_LINKS: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: action.payload
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

  UPDATE_LINK: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: [...action.payload]
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
  },

  SET_ACTIVE_LINK_INDEX: (state, action) => {
    return ({
      ...state,
      activeLinkIndex: action.payload
    })
  },

  LINK_SAVED: (state, action) => {
    return ({
      ...state,
      linkSaved: action.payload
    })
  }
}, {
  item: null,
  activeLinkIndex: 0,
  linkSaved: false
})

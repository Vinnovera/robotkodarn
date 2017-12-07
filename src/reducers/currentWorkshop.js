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

  UPDATE_PART: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...action.payload]
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

  SET_CURRENT_EDITING_TYPE: (state, action) => {
    return ({
      ...state,
      currentEditingType: action.payload
    })
  },

  CODE_SAVED: (state, action) => {
    return ({
      ...state,
      codeSaved: action.payload
    })
  }
}, {
  item: null,
  loginAttemptTimestamp: +new Date(),
  activeLinkIndex: 0,
  currentEditingType: 'part',
  codeSaved: false
})

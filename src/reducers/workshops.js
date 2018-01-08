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

  UPDATE_WORKSHOP_TITLE_START: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        title: action.payload
      }
    })
  },

  UPDATE_WORKSHOP_TITLE_DONE: (state, action) => {
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
  },

  UPDATE_PARTS: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: action.payload
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

  UPDATE_PART_TITLE: (state, action) => {
    const parts = state.item.parts.map((part) => {
      if (part._id === action.payload.partId) {
        return {
          ...part,
          title: action.payload.title
        }
      }
      return part
    })

    return ({
      ...state,
      item: {
        ...state.item,
        parts
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

  CODE_SAVED: (state, action) => {
    return ({
      ...state,
      codeSaved: action.payload
    })
  },

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
  userWorkshops: [],
  item: null,
  currentEditingType: 'part',
  loginAttemptTimestamp: +new Date(),
  codeSaved: false,
  activeLinkIndex: 0,
  linkSaved: false
})

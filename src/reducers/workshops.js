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

  UPDATE_PARTS_START: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: action.payload
      }
    })
  },

  UPDATE_PARTS_DONE: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: action.payload
      }
    })
  },

  ADD_PART_START: (state) => {
    return ({
      ...state,
      isAddingPart: true
    })
  },

  ADD_PART_DONE: (state, action) => {
    return ({
      ...state,
      isAddingPart: false,
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

  UPDATE_PART_TITLE_START: (state, action) => {
    const parts = state.item.parts.map((part) => {
      if (part._id === action.payload.partId) {
        return {
          ...part,
          title: action.payload.partTitle
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

  UPDATE_PART_TITLE_DONE: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...action.payload]
      }
    })
  },

  REMOVE_PART_START: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: [...action.payload]
      }
    })
  },

  REMOVE_PART_DONE: (state, action) => {
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

  UPDATE_LINKS_START: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: action.payload
      }
    })
  },

  UPDATE_LINKS_DONE: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        links: action.payload
      }
    })
  },

  ADD_LINK_START: (state) => {
    return ({
      ...state,
      isAddingLink: true
    })
  },

  ADD_LINK_DONE: (state, action) => {
    return ({
      ...state,
      isAddingLink: false,
      item: {
        ...state.item,
        links: [...state.item.links, action.payload]
      }
    })
  },

  UPDATE_LINK_START: (state, action) => {
    const links = state.item.links.map((link) => {
      if (link._id === action.payload.linkId) {
        return {
          ...link,
          title: action.payload.title
        }
      }
      return link
    })

    return ({
      ...state,
      item: {
        ...state.item,
        links
      }
    })
  },

  UPDATE_LINK_DONE: (state, action) => {
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
  linkSaved: false,
  isAddingPart: false,
  isAddingLink: false
})

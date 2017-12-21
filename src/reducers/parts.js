import { handleActions } from 'redux-actions'

export default handleActions({
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

  UPDATE_PARTS: (state, action) => {
    return ({
      ...state,
      item: {
        ...state.item,
        parts: action.payload
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
  }
}, {
  item: null,
  codeSaved: false
})

import axios from 'axios'

const UPDATE_PARTS = 'UPDATE_PARTS'
const UPDATE_PART_TITLE = 'UPDATE_PART_TITLE'
const UPDATE_PART = 'UPDATE_PART'
const ADD_PART = 'ADD_PART'
const CODE_SAVED = 'CODE_SAVED'
const REMOVE_PART = 'REMOVE_PART'
const SET_PARTS_TO_EDIT = 'SET_PARTS_TO_EDIT'
const SET_ACTIVE_PART_INDEX = 'SET_ACTIVE_PART_INDEX'
const SET_CODE_TO_UNSAVED = 'SET_CODE_TO_UNSAVED'

// -----------------------------------------------------------------------------
// updateWorkshopParts, updates the workshop parts in current workshop
// -----------------------------------------------------------------------------
export const updateWorkshopParts = (workshopId, partIds) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopId}/parts`, partIds, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_PARTS,
        payload: data.parts
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// updatePartTitle, edits a part title
// -----------------------------------------------------------------------------
export const updatePartTitle = (title, workshopId, partId) => (dispatch) => {
  dispatch({
    type: UPDATE_PART_TITLE,
    payload: { title, partId }
  })

  axios
    .put(`/api/workshop/${workshopId}/part/${partId}`, { title }, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_PART,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addPart, create part and adds it to workshop in database
// -----------------------------------------------------------------------------
export const addPart = (part, workshopId) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshopId}/part`, part, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_PART,
        payload: data
      })
    })
    .catch(error => console.log(error))
}


// -----------------------------------------------------------------------------
// updatePart, edits a specific part in a workshop
// -----------------------------------------------------------------------------
export const updatePartContent = (content, workshopId, partId) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopId}/part/${partId}`, { content }, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_PART,
        payload: data
      })

      dispatch({
        type: CODE_SAVED,
        payload: true
      })

      setTimeout(() => {
        dispatch({
          type: CODE_SAVED,
          payload: false
        })
      }, 2000)
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removePart, removes part from database
// -----------------------------------------------------------------------------
export const removePart = (partId, workshopId) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopId}/part/${partId}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_PART,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// setPartsToEdit, Sets the parts that user can edit in editor
// -----------------------------------------------------------------------------
export const setPartsToEdit = parts => (dispatch) => {
  dispatch({
    type: SET_PARTS_TO_EDIT,
    payload: parts
  })
}

// -----------------------------------------------------------------------------
// setActivePartIndex, sets clicked part to state
// -----------------------------------------------------------------------------
export const setActivePartIndex = index => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_PART_INDEX,
    payload: index
  })
}

// -----------------------------------------------------------------------------
// setCodeToUnsaved, sets the code to be unsaved
// -----------------------------------------------------------------------------
export const setCodeToUnsaved = isUnsaved => (dispatch) => {
  dispatch({
    type: SET_CODE_TO_UNSAVED,
    payload: isUnsaved
  })
}

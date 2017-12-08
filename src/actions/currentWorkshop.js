import axios from 'axios'
import { routeActions } from 'redux-simple-router'

const SET_WORKSHOP_BY_PIN = 'SET_WORKSHOP_BY_PIN'
const UPDATE_TIMESTAMP = 'UPDATE_TIMESTAMP'
const SET_MESSAGE = 'SET_MESSAGE'
const UPDATE_TITLE = 'UPDATE_TITLE'

const ADD_PART = 'ADD_PART'
const UPDATE_PART = 'UPDATE_PART'
const REMOVE_PART = 'REMOVE_PART'

const ADD_LINK = 'ADD_LINK'
const UPDATE_LINK = 'UPDATE_LINK'
const REMOVE_LINK = 'REMOVE_LINK'

const SET_ACTIVE_LINK_INDEX = 'SET_ACTIVE_LINK_INDEX'
const SET_CURRENT_EDITING_TYPE = 'SET_CURRENT_EDITING_TYPE'

const CODE_SAVED = 'CODE_SAVED'

// -----------------------------------------------------------------------------
// updateWorkshopTitle, updates the workshop title in current workshop
// -----------------------------------------------------------------------------
export const updateWorkshopTitle = (workshopId, title) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopId}`, { title }, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_TITLE,
        payload: data.title
      })
    })
    .catch(error => console.log(error))
}


// -----------------------------------------------------------------------------
// updatePartTitle, edits a part title
// -----------------------------------------------------------------------------
export const updatePartTitle = (title, workshopId, partId) => (dispatch) => {
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
// addLink, creates link and add it to workshop in database
// -----------------------------------------------------------------------------
export const addLink = (link, workshopId) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshopId}/link`, link, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_LINK,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// updateLink, edits a specific link in a workshop
// -----------------------------------------------------------------------------
export const updateLink = (updatedLinkObject, workshopID, linkId) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopID}/link/${linkId}`, updatedLinkObject, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_LINK,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeLink, removes link from database
// -----------------------------------------------------------------------------
export const removeLink = (linkId, workshopId) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopId}/link/${linkId}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_LINK,
        payload: data
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// setActiveLinkIndex, set active link index
// -----------------------------------------------------------------------------
export const setActiveLinkIndex = linkIndex => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_LINK_INDEX,
    payload: linkIndex
  })
}

// -----------------------------------------------------------------------------
// findWorkshopByPin, gets workshop by typed in PIN in the login page
// -----------------------------------------------------------------------------

export const findWorkshopByPin = pin => (dispatch) => {
  axios
    .get(`/api/workshop/pin/${pin}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: SET_WORKSHOP_BY_PIN,
          payload: response.data
        })
      }
    })
    .catch(() => {
      dispatch({
        type: UPDATE_TIMESTAMP,
        payload: +new Date()
      })

      dispatch(routeActions.push('/login'))
    })
}

//------------------------------------------------------------------------------
// clearWorkshop, resets state to null when leaving workspace component.
// -----------------------------------------------------------------------------
export const clearWorkshop = () => (dispatch) => {
  dispatch({ type: SET_WORKSHOP_BY_PIN, payload: null })
}

//------------------------------------------------------------------------------
// setCurrentEditingType, sets the current editing type to part with an
// index of that part or link with that index
// -----------------------------------------------------------------------------
export const setCurrentEditingType = editingType => (dispatch) => {
  dispatch({
    type: SET_CURRENT_EDITING_TYPE,
    payload: editingType
  })
}

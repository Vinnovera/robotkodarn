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
export const updatePart = (updatedContent, workshopId, partId) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopId}/part/${partId}`, updatedContent, {
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
        type: SET_MESSAGE,
        payload: 'Övningen är nu uppdaterat.',
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removePart, removes part from database
// -----------------------------------------------------------------------------
export const removePart = (partId, workshopId) => (dispatch) => {
  console.log( partId, workshopId )
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
export const addLink = (link, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/link`, link, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_LINK,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Länk med titeln ${data.title} är nu tillagd.`,
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// updateLink, edits a specific link in a workshop
// -----------------------------------------------------------------------------
export const updateLink = (updatedContent, workshopID, linkId) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshopID}/link/${linkId}`, updatedContent, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: UPDATE_LINK,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: 'Länken är nu uppdaterad.',
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeSelectedLink, removes link from database
// -----------------------------------------------------------------------------
export const removeLink = (link, workshop) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshop}/link/${link}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_LINK,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: 'Länken är nu borttagen.',
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
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

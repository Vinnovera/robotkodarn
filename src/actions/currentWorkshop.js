import axios from 'axios'
import { routeActions } from 'redux-simple-router'

const SET_MESSAGE = 'SET_MESSAGE'
const ADD_PART_TO_WORKSHOP = 'ADD_PART_TO_WORKSHOP'
const ADD_LINK_TO_WORKSHOP = 'ADD_LINK_TO_WORKSHOP'
const SET_WORKSHOP_BY_PIN = 'SET_WORKSHOP_BY_PIN'

// -----------------------------------------------------------------------------
// changeTitle, edits the title of the workshop object
// -----------------------------------------------------------------------------
export const changeTitle = (title, workshop) => (dispatch) => {
  axios
    .put(`/api/workshop/${workshop._id}`, title, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen har nu titeln ${data.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addPart, create part and adds it to workshop in database
// -----------------------------------------------------------------------------
export const addPart = (part, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/part`, part, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_PART_TO_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Delmomentet med titeln ${data.title} är nu tillagt.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removePart, removes part from database
// -----------------------------------------------------------------------------
export const removePart = (part, workshop) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshop}/part/${part}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: SET_MESSAGE,
        payload: 'Delmomentet är nu borttaget.'
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
        type: ADD_LINK_TO_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Länk med titeln ${data.title} är nu tillagd.`
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
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Delmomentet ${link.title} är nu borttaget.`
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
        dispatch({ type: SET_WORKSHOP_BY_PIN, payload: response.data })
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/login'))
    })
}

//------------------------------------------------------------------------------
// clearWorkshop, resets state to null when leaving workspace component.
// -----------------------------------------------------------------------------

export const clearWorkshop = () => (dispatch) => {
  dispatch({ type: SET_WORKSHOP_BY_PIN, payload: null })
}

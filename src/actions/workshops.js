import { routeActions } from 'redux-simple-router'
import axios from 'axios'

const SET_MESSAGE = 'SET_MESSAGE'
const ADD_USER_WORKSHOP = 'ADD_USER_WORKSHOP'
const REMOVE_USER_WORKSHOP = 'REMOVE_USER_WORKSHOP'
const SET_USER_WORKSHOPS = 'SET_USER_WORKSHOPS'
const SET_WORKSHOP_BY_PIN = 'SET_WORKSHOP_BY_PIN'

// -----------------------------------------------------------------------------
// createWorkshop, creates empty workshop with a title and a PIN
// -----------------------------------------------------------------------------
export const addUserWorkshop = workshop => (dispatch) => {
  dispatch({
    type: ADD_USER_WORKSHOP,
    payload: workshop
  })

  dispatch({
    type: SET_MESSAGE,
    payload: `Workshopen ${workshop.title} är nu tillagd med pinkoden: ${workshop.pincode}.`
  })
}

export const createWorkshop = workshop => (dispatch) => {
  axios
    .post('/api/workshop', workshop, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => dispatch(addUserWorkshop(data)))
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Copy an existing workshop
// -----------------------------------------------------------------------------
export const copyWorkshop = workshopID => (dispatch) => {
  axios
    .post(`/api/copyWorkshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => dispatch(addUserWorkshop(data)))
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeWorkshop, removes workshop from state and set user message
// -----------------------------------------------------------------------------
export const removeUserWorkshop = id => (dispatch) => {
  dispatch({
    type: REMOVE_USER_WORKSHOP,
    payload: id
  })

  dispatch({
    type: SET_MESSAGE,
    payload: 'Workshopen är nu borttagen.'
  })
}

// -----------------------------------------------------------------------------
// deleteWorkshop, removes workshop from database
// -----------------------------------------------------------------------------
export const deleteWorkshop = workshopID => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopID}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => dispatch(removeUserWorkshop(data.id)))
    .catch(error => console.log(error))
}
// -----------------------------------------------------------------------------
// changeTitle, edits the title of the workshop object
// -----------------------------------------------------------------------------
export const changeTitle = (title, workshop) => (dispatch) => {
  console.log(title)
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
// addPart, adds part to workshop
// -----------------------------------------------------------------------------
export const addPart = (content, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/part`, content, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response) => {
      dispatch({ type: 'SET_PARTS', payload: response.data })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${workshop.title} har nu delmomentet ${content.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// addLink, adds link to workshop
// -----------------------------------------------------------------------------
export const addLink = (link, workshop) => (dispatch) => {
  axios
    .post(`/api/workshop/${workshop._id}/link`, link, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((/* response */) => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${workshop.title} har nu referenslänken ${link.title}.`
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeSelectedPart, removes part from database
// -----------------------------------------------------------------------------
export const removeSelectedPart = (part, workshop) => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshop}/part/${part}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      // TODO: Ta ut vilket delmoment som är borttaget.
      dispatch({
        type: SET_MESSAGE,
        payload: 'Delmomentet är nu borttaget.'
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// removeSelectedLink, removes link from database
// -----------------------------------------------------------------------------
export const removeSelectedLink = (link, workshop) => (dispatch) => {
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

// -----------------------------------------------------------------------------
// getWorkshopsByUserId, get logged in users' workshops
// -----------------------------------------------------------------------------
export const getWorkshopsByUserId = () => (dispatch) => {
  axios
    .get('/api/workshopsbyuser', {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response) => {
      dispatch({ type: SET_USER_WORKSHOPS, payload: response.data })
    })
    .catch(error => console.log(error))
}


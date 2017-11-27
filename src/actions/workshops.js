import axios from 'axios'

const SET_WORKSHOPS = 'SET_WORKSHOPS'
const ADD_WORKSHOP = 'ADD_WORKSHOP'
const REMOVE_WORKSHOP = 'REMOVE_WORKSHOP'
const SET_MESSAGE = 'SET_MESSAGE'
const UPDATE_TITLE = 'UPDATE_TITLE'

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
      dispatch({ type: SET_WORKSHOPS, payload: response.data })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// createWorkshop, creates empty workshop with a title and a PIN
// -----------------------------------------------------------------------------
export const createWorkshop = workshop => (dispatch) => {
  axios
    .post('/api/workshop', workshop, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`,
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// Copy an existing workshop
// -----------------------------------------------------------------------------
export const copyWorkshop = workshopId => (dispatch) => {
  axios
    .post(`/api/copyWorkshop/${workshopId}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: ADD_WORKSHOP,
        payload: data
      })

      dispatch({
        type: SET_MESSAGE,
        payload: `Workshopen ${data.title} är nu tillagd med pinkoden: ${data.pincode}.`,
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// deleteWorkshop, removes workshop from database
// -----------------------------------------------------------------------------
export const deleteWorkshop = workshopId => (dispatch) => {
  axios
    .delete(`/api/workshop/${workshopId}`, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_WORKSHOP,
        payload: data.id
      })

      dispatch({
        type: SET_MESSAGE,
        payload: 'Workshopen är nu borttagen.',
        time: +new Date()
      })
    })
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// setWorkshopTitle, updates the workshop title in current workshop
// -----------------------------------------------------------------------------
export const setWorkshopTitle = (workshopId, title) => (dispatch) => {
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


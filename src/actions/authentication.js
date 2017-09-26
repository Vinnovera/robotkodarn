import { routeActions } from 'redux-simple-router'
import axios from 'axios'

// -----------------------------------------------------------------------------
// signIn, takes email and hashed input
// -----------------------------------------------------------------------------
export const signIn = (credentials, path) => (dispatch) => {
  const data = JSON.stringify(credentials)

  axios.post('/auth/signIn', data, {
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(() => dispatch(routeActions.push(path)))
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// signOut, clears cookies
// -----------------------------------------------------------------------------
export const signOut = path => (dispatch) => {
  axios.get('/auth/logout')

    .then(() => dispatch(routeActions.push(path)))
    .catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// isLoggedIn, checks session cookie
// -----------------------------------------------------------------------------
// TODO: Needs to check if user is completed. Right now, uncompleted users can access admin.
export const isLoggedIn = path => (dispatch) => {
  axios.get('/api/isLoggedIn')
    .then((response) => {
      dispatch({
        type: 'IS_LOGGED_IN',
        payload: response.data.credentials.email
      })

      if (path !== null) {
        dispatch(routeActions.push(path))
      }
    })
    .catch(() => {
      dispatch(routeActions.push('/admin'))
    })
}

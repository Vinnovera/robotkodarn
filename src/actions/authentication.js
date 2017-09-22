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
    .catch((/* error */) => {
      dispatch(routeActions.push('/admin'))
    })
}

// -----------------------------------------------------------------------------
// toggleUserRegister, toggle the form
// betweet login or registration
// -----------------------------------------------------------------------------
export const toggleUserRegister = loginOrRegister => (dispatch) => {
  dispatch({
    type: 'SET_LOGIN_OR_REGISTER',
    payload: loginOrRegister
  })
}

// -----------------------------------------------------------------------------
// registerUser, takes the credentials
// from the component (hashed pass, name and email)
// and posts this to the server
// -----------------------------------------------------------------------------
export const registerUser = credentials => (dispatch) => {
  axios
    .post('/api/user', credentials, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(() => dispatch(routeActions.push('/admin'))) // TODO: Print message to user / redirect to logged in.
    .catch((error) => {
      console.log(error) // TODO: Should dispatch an error to user
    })
}

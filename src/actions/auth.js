import { routeActions } from 'redux-simple-router'
import axios from 'axios'

const SET_LOGGED_IN_STATUS = 'SET_LOGGED_IN_STATUS'
const SET_USER_INFO = 'SET_USER_INFO'

// -----------------------------------------------------------------------------
// signIn, takes email and hashed input
// -----------------------------------------------------------------------------
export const signIn = (credentials, redirect) => (dispatch) => {
	const data = JSON.stringify(credentials)
	axios.post('/auth/signIn', data, {
		headers: {
			'content-type': 'application/json'
		}
	}).then((response) => {
		if (response.status === 200) {
			dispatch({
				type: SET_LOGGED_IN_STATUS,
				payload: {
					isLoggedIn: true
				}
			})

			dispatch(routeActions.push(redirect))
		}
	}).catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// signOut, clears cookies
// -----------------------------------------------------------------------------

export const signOut = path => (dispatch) => {
	axios.get('/auth/logout')
		.then(() => {
			dispatch({
				type: SET_LOGGED_IN_STATUS,
				payload: {
					isLoggedIn: false
				}
			})
			// Remove user info when logging out
			dispatch({
				type: SET_USER_INFO,
				payload: {}
			})
			dispatch(routeActions.push(path))
		})
		.catch(error => console.log(error))
}

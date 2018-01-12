import { routeActions } from 'redux-simple-router'
import axios from 'axios'

export const IS_AUHTORIZED = 'IS_AUHTORIZED'

// -----------------------------------------------------------------------------
// signIn, takes email and hashed input
// -----------------------------------------------------------------------------
export const signIn = (credentials, redirect) => (dispatch) => {
	const data = JSON.stringify(credentials)
	axios.post('/auth/signIn', data, {
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(() => dispatch(routeActions.push(redirect)))
		.catch(error => console.log(error))
}

// -----------------------------------------------------------------------------
// signOut, clears cookies
// -----------------------------------------------------------------------------

export const signOut = path => (dispatch) => {
	axios.get('/auth/logout')
		.then(() => {
			// Remove user from Redux State.
			dispatch({
				type: IS_AUHTORIZED,
				payload: {
					isLoggedIn: false
				}
			})
			dispatch(routeActions.push(path))
		})
		.catch(error => console.log(error))
}

import axios from 'axios'

const ADD_INVITE_ID = 'ADD_INVITE_ID'

/**
 * Adds the invitation ID in database. When added, dispatch
 * message to user that unique ID is added.
 */
const addInvitationID = () => (dispatch) => {
	axios
		.post('/api/invite', {}, {
			headers: {
				'content-type': 'application/json'
			}
		})
		.then((response) => {
			dispatch({
				type: ADD_INVITE_ID,
				payload: response.data.inviteID
			})
		})
		.catch(error => console.log(error))
}

export default addInvitationID

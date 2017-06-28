import { handleActions } from 'redux-actions'

export default handleActions({
    SET_LOGIN_OR_REGISTER: (state, action) => {

        return ({
            ...state,
            loginOrRegister: action.payload
        })
    },
    SET_USER: (state, action) => {

        return ({
            ...state,
            user: action.payload
        })
    }
}, {
    loginOrRegister: 'login'
})
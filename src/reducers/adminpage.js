import { handleActions } from 'redux-actions'

export default handleActions({
    SET_WORKSHOPS: (state, action) => {

        return ({
            ...state,
            userWorkshops: action.payload
        })
    },
    SET_SELECTED_WORKSHOP_INDEX: (state, action) => {

        return ({
            ...state,
            selectedWorkshopIndex: action.payload
        })
    },
    SET_SELECTED_PART_INDEX: (state, action) => {

        return ({
            ...state,
            selectedPartIndex: action.payload
        })
    },
    SET_SELECTED_LINK_INDEX: (state, action) => {

        return ({
            ...state,
            selectedLinkIndex: action.payload
        })
    },
    SET_PARTS: (state, action) => {

        return ({
            ...state,
            workshopParts: action.payload
        })
    },
    SET_MESSAGE: (state, action) => {

        return ({
            ...state,
            message: action.payload
        })
    }
}, {
    userWorkshops: [],
    selectedWorkshopIndex: null,
    selectedPartIndex: null,
    selectedLinkIndex: null,
    message: null
})

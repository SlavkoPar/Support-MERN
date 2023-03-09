import { Reducer } from 'react'
import { initialAuthUser } from 'global/GlobalProvider';
import { IGlobalState, GlobalActionTypes, GlobalActions, ROLES } from "./types";

export const reducer: Reducer<IGlobalState, GlobalActions> = (state, action) => {
	const newState = globalReducer(state, action);
    //const aTypesToStore = Object.keys(GlobalActionTypes).filter(a => a !== GlobalActionTypes.SET_ERROR);
    const aTypesToStore = [	"AUTHENTICATE", "DARK_MODE", "LIGHT_MODE"];
	if (aTypesToStore.includes(action.type)) {
		localStorage.setItem('GLOBAL_STATE', JSON.stringify({ ...newState, error: undefined }));
	}
	return newState;
}

const globalReducer: Reducer<IGlobalState, GlobalActions> = (state, action) => {
    const s = action.type;

    switch (action.type) {

        case GlobalActionTypes.SET_LOADING:
            return {
                ...state,
                loading: true
            }

        case GlobalActionTypes.SET_STATE:
            const { globalState } = action.payload;
            return {
                ...state,
                ...globalState
            }

        case GlobalActionTypes.SET_ERROR: {
            const { error } = action.payload;
            return { 
                ...state,
                error,
                loading: false
            };
        }
        
        case GlobalActionTypes.AUTHENTICATE: {
            const { user } = action.payload;
            return {
                ...state,
                authUser: {
                    userId: user._id!,
                    userName: user.userName!,
                    password: user.password!,
                    role: user.role,
                    registered: user.created!.date
                    //visited: user.visited!.date
                },
                canEdit: user.role !== ROLES.VIEWER,
                isAuthenticated: true
            };
        }

        case GlobalActionTypes.UN_AUTHENTICATE: {
            return {
                ...state,
                authUser: initialAuthUser,
                isAuthenticated: false
            };
        }

        case GlobalActionTypes.LIGHT_MODE:
            return { ...state, isDarkMode: false, variant: 'light', bg: 'light' };

        case GlobalActionTypes.DARK_MODE:
            return { ...state, isDarkMode: true, variant: 'dark', bg: 'dark' };

        default: {
            throw Error('Unknown action: ' + s);
        }
    }
};


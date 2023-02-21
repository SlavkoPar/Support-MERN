import React from 'react'
import { IGlobalState, ILoginUser, GlobalActionTypes } from "./globalTypes";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};



type GlobalPayload = {
    [GlobalActionTypes.AUTHENTICATE]: {
        loginUser: ILoginUser
    };
    [GlobalActionTypes.LIGHT_MODE]: {
    };
    [GlobalActionTypes.DARK_MODE]: {
    };
};

export type GlobalActions = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

export const globalReducer: React.Reducer<IGlobalState, GlobalActions> = (state, action) => {
    const s = action.type;
    switch (action.type) {
        case GlobalActionTypes.AUTHENTICATE:
            return {
                ...state,
                isAuthenticated: true
            };
        case GlobalActionTypes.LIGHT_MODE:
            return { ...state, isDarkMode: false, variant: 'light', bg: 'light' };
        case GlobalActionTypes.DARK_MODE:
            return { ...state, isDarkMode: true, variant: 'dark', bg: 'dark' };
        default: {
            throw Error('Unknown action: ' + s);
        }
    }
};


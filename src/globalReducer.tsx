import React from 'react'
import { IGlobalState } from "./globalTypes";

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

export enum ActionTypes {
    Authenticate = "AUTHENTICATE",
    DARK_MODE = "DARK_MODE",
    LIGHT_MODE = "LIGHT_MODE"
}

type GlobalPayload = {
    [ActionTypes.Authenticate]: {
        id: number;
        name: string;
        price: number;
    };
    [ActionTypes.LIGHT_MODE]: {
    };
    [ActionTypes.DARK_MODE]: {
    };
};

export type GlobalActions = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

export const globalReducer: React.Reducer<IGlobalState, GlobalActions> = (state, action) => {
    const s = action.type;
    switch (action.type) {
        case ActionTypes.Authenticate:
            return {
                ...state,
                isAuthenticated: true
            };
        case ActionTypes.LIGHT_MODE:
            return { ...state, isDarkMode: false, variant: 'light', bg: 'light' };
        case ActionTypes.DARK_MODE:
            return { ...state, isDarkMode: true, variant: 'dark', bg: 'dark' };
        default: {
            throw Error('Unknown action: ' + s);
        }
    }
};


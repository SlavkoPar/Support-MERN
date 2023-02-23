import React from 'react'
import { IGlobalState, ILoginUser, GlobalActionTypes } from "./types";
import { IUser } from '../users/types';
import { AxiosError } from 'axios';

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
    [GlobalActionTypes.SET_LOADING]: {
    };
    [GlobalActionTypes.AUTHENTICATE]: {
        user: IUser
    };
    [GlobalActionTypes.SET_ERROR]: {
        error: AxiosError;
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


        case GlobalActionTypes.SET_LOADING:
            return {
                ...state,
                loading: true
            }

        case GlobalActionTypes.SET_ERROR: {
            const { error } = action.payload;
            return { ...state, error, loading: false };
        }

        case GlobalActionTypes.AUTHENTICATE: {
            const { user } = action.payload;
            return {
                ...state,
                authUser: {
                    userId: user._id!,
                    userName: user.userName,
                    role: user.role,
                    registered: user.created!.date
                    //visited: user.visited!.date
                },
                isAuthenticated: true
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


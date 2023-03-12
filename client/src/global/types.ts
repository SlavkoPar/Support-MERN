// Define the Global State
import { AxiosError } from 'axios';
import { Types } from 'mongoose';
import { IUser } from 'users/types';

export interface IDateAndBy {
	date: Date,
	by: {
		userId: Types.ObjectId,
		userName?: string
	}
}

export interface IAuthUser {
	userId: Types.ObjectId, // fiktivni _id
	color?: string,
	userName: string,
	password: string,
	role: ROLES,
	registered?: Date,
	visited?: Date
}

export enum ROLES {
	OWNER = 'OWNER',
	ADMIN = 'ADMIN',
	EDITOR = 'EDITOR',
	VIEWER = 'VIEWER',
}

export interface IGlobalState {
	isAuthenticated: boolean | null;
	authUser: IAuthUser;
	canEdit: boolean,
	isDarkMode: boolean;
	variant: string,
	bg: string,
	loading: boolean;
	error?: AxiosError;
}

export interface IGlobalContext {
	globalState: IGlobalState,
	loadStateFromLocalStorage: () => boolean,
	registerUser: (loginUser: ILoginUser) => void,
	signInUser: (loginUser: ILoginUser) => void
}

export enum GlobalActionTypes {
	SET_STATE = 'SET_STATE',
	SET_LOADING = 'SET_LOADING',
	AUTHENTICATE = "AUTHENTICATE",
	UN_AUTHENTICATE = "UN_AUTHENTICATE",
	SET_ERROR = 'SET_ERROR',
    DARK_MODE = "DARK_MODE",
    LIGHT_MODE = "LIGHT_MODE"
}

export interface ILoginUser {
    userName: string;
    email?: string;
    password: string;
	date?: Date;
}

//export type ActionMap<M extends { [index: string]: any }> = {
export type ActionMap<M extends Record<string, any>> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};

export type GlobalPayload = {
    [GlobalActionTypes.SET_LOADING]: {
    };

    [GlobalActionTypes.SET_STATE]: {
        globalState: IGlobalState
    };

    [GlobalActionTypes.AUTHENTICATE]: {
        user: IUser
    };

	[GlobalActionTypes.UN_AUTHENTICATE]: {
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
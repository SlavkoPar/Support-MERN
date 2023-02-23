// Define the Global State
import { AxiosError } from 'axios';
import { Types } from 'mongoose';

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
	userName?: string,
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
	authError?: string;
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
	registerUser: (loginUser: ILoginUser) => void,
	signInUser: (loginUser: ILoginUser) => void
}

export enum GlobalActionTypes {
	SET_LOADING = 'SET_LOADING',
	AUTHENTICATE = "AUTHENTICATE",
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

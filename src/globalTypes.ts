// Define the Global State
import { Schema, Types } from 'mongoose';

export interface IAuthUser {
	userId: Types.ObjectId, // fiktivni _id
	color?: string,
	userName?: string,
	role: ROLES,
	canEdit: boolean,
	darkMode: boolean;
	registered?: Date,
	visited?: Date
}

export enum ROLES {
	OWNER = 'OWNER',
	ADMIN = 'ADMIN',
	EDITOR = 'EDITOR',
	VIEWER = 'VIEWER',
	FIRST_REGISTERED_USER_IS_OWNER = 'FIRST_REGISTERED_USER_IS_OWNER'
}

export interface ILogin {
	userName: string;
	pwd: string;
}

export interface IGlobalState {
	isAuthenticated: boolean | null;
	authError?: string;
	user: IAuthUser;
}


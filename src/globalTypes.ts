// Define the Global State
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

export interface ILogin {
	userName: string;
	pwd: string;
}

export interface IGlobalState {
	isAuthenticated: boolean | null;
	authError?: string;
	authUser: IAuthUser;
	canEdit: boolean,
	darkMode: boolean;
}


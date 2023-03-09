import { Types } from 'mongoose';

import { IDateAndBy, ROLES } from 'global/types';

export const FORM_MODES = {
	UNDEFINED: undefined,
	NULL: null,
	ADD: 'ADD',
	EDIT: 'EDIT',
	DELETE: 'DELETE'
}

export interface IUser {
	_id?: Types.ObjectId,
	userName: string,
	password?: string,
	level: number,
	role: ROLES,
	parentUser: Types.ObjectId | null,
	isExpanded?: boolean,
	created?: IDateAndBy,
	createdBy?: string,
	modified?: IDateAndBy,
	modifiedBy?: string,
	inEditing?: boolean,
	inAdding?: boolean
}


export interface IParentInfo {
    parentUser: Types.ObjectId | null,
    level: number
  }

export interface IUsersState {
	mode: string | null,
	loading: boolean,
	users: IUser[],
	error?: any
}

export interface IUsersContext {
	store: IUsersState,
	getUsers: ({parentUser, level}: { parentUser: Types.ObjectId | null, level: number }) => void,
	editUser: (_id: Types.ObjectId) => void,
	updateUser:  (user: IUser) => void,
	deleteUser: (_id: Types.ObjectId) => void
}

export interface IUserFormProps {
	initialValues: IUser;
	isEdit: boolean;
	submitForm: (user: IUser) => void,
	children: string
  }


export enum ActionTypes  {
	SET_LOADING = 'SET_LOADING',
	SET_USERS = 'SET_USERS',
	CLEAN_SUB_TREE = 'CLEAN_SUB_TREE',
	SET_ERROR = 'SET_ERROR',
	ADD = 'ADD',
	REFRESH_ADDED_USER = 'REFRESH_ADDED_USER',
	REFRESH_UPDATED_USER = 'REFRESH_UPDATED_USER',
	EDIT = 'EDIT',
	DELETE = 'DELETE',
	CLOSE_ADDING_FORM = 'CLOSE_ADDING_FORM',
	CANCEL_ADDING_FORM = 'CANCEL_ADDING_FORM',
	CLOSE_EDITING_FORM = 'CLOSE_EDITING_FORM',
	CANCEL_EDITING_FORM = 'CANCEL_EDITING_FORM'
  }

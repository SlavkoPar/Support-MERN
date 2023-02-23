import { Types } from 'mongoose';

import { IDateAndBy } from '../global/types';
import { IOption } from '../common/types';
import { AxiosError } from 'axios';

export const FORM_MODES = {
	UNDEFINED: undefined,
	NULL: null,
	ADD: 'ADD',
	EDIT: 'EDIT',
	DELETE: 'DELETE'
}

export interface ICategory {
	_id?: Types.ObjectId,
	title: string,
	level: number,
	// questions: IQuestion[],
	parentCategory: Types.ObjectId | null,
	isExpanded?: boolean,
	created?: IDateAndBy,
	createdBy?: string,
	modified?: IDateAndBy,
	modifiedBy?: string,
	inEditing?: boolean,
	inAdding?: boolean
}

export interface IParentInfo {
    parentCategory: Types.ObjectId | null,
    level: number
  }

export interface ICategoriesState {
	mode: string | null,
	loading: boolean,
	categories: ICategory[],
	error?: AxiosError;
}

export interface ICategoriesContext {
	store: ICategoriesState,
	getCategories: ({parentCategory, level}: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createCategory: (category: ICategory) => void,
	editCategory: (_id: Types.ObjectId) => void,
	updateCategory:  (category: ICategory) => void,
	deleteCategory: (_id: Types.ObjectId) => void
}

export interface ICategoryFormProps {
	initialValues: ICategory;
	isEdit: boolean;
	submitForm: (category: ICategory) => void,
	children: string
  }


export enum ActionTypes  {
	SET_LOADING = 'SET_LOADING',
	SET_CATEGORIES = 'SET_CATEGORIES',
	CLEAN_SUB_TREE = 'CLEAN_SUB_TREE',
	SET_ERROR = 'SET_ERROR',
	ADD = 'ADD',
	REFRESH_ADDED_CATEGORY = 'REFRESH_ADDED_CATEGORY',
	REFRESH_UPDATED_CATEGORY = 'REFRESH_UPDATED_CATEGORY',
	EDIT = 'EDIT',
	DELETE = 'DELETE',
	CLOSE_ADDING_FORM = 'CLOSE_ADDING_FORM',
	CANCEL_ADDING_FORM = 'CANCEL_ADDING_FORM',
	CLOSE_EDITING_FORM = 'CLOSE_EDITING_FORM',
	CANCEL_EDITING_FORM = 'CANCEL_EDITING_FORM'
  }



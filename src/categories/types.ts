import { Types } from 'mongoose';

import { IDateAndBy } from '../global/types';
import { AxiosError } from 'axios';
import { ActionMap } from '../global/types'
import { IQuestion } from '../questions/types';

export const FORM_MODES = {
	UNDEFINED: undefined,
	NULL: null,
	ADD: 'ADD',
	VIEW: 'VIEW',
	EDIT: 'EDIT',
	DELETE: 'DELETE',
	// questions
	ADD_QUESTION: 'ADD_QUESTION'
}

export interface ICategory {
	_id?: Types.ObjectId,
	title: string,
	level: number,
	questions: IQuestion[],
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
	state: ICategoriesState,
	getCategories: ({ parentCategory, level }: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createCategory: (category: ICategory) => void,
	viewCategoryQuestions: (_id: Types.ObjectId) => void,
	editCategory: (_id: Types.ObjectId) => void,
	updateCategory: (category: ICategory) => void,
	deleteCategory: (_id: Types.ObjectId) => void,
	//////////////
	// questions
	// getQuestions: ({parentCategory, level}: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createQuestion: (question: IQuestion) => void,
	editQuestion: (_id: Types.ObjectId) => void,
	updateQuestion:  (question: IQuestion) => void,
	deleteQuestion: (_id: Types.ObjectId) => void
}

export interface ICategoryFormProps {
	initialValues: ICategory;
	isEdit: boolean;
	submitForm: (category: ICategory) => void,
	children: string
}


export enum ActionTypes {
	SET_LOADING = 'SET_LOADING',
	SET_CATEGORIES = 'SET_CATEGORIES',
	CLEAN_SUB_TREE = 'CLEAN_SUB_TREE',
	SET_ERROR = 'SET_ERROR',
	ADD = 'ADD',
	REFRESH_ADDED_CATEGORY = 'REFRESH_ADDED_CATEGORY',
	REFRESH_UPDATED_CATEGORY = 'REFRESH_UPDATED_CATEGORY',
	VIEW_CATEGORY_QUESTIONS = 'VIEW_CATEGORY_QUESTIONS',
	EDIT = 'EDIT',
	DELETE = 'DELETE',
	CLOSE_ADDING_FORM = 'CLOSE_ADDING_FORM',
	CANCEL_ADDING_FORM = 'CANCEL_ADDING_FORM',
	CLOSE_EDITING_FORM = 'CLOSE_EDITING_FORM',
	CANCEL_EDITING_FORM = 'CANCEL_EDITING_FORM',

	// questions
	SET_CATEGORY_QUESTIONS = 'SET_CATEGORY_QUESTIONS',
	ADD_QUESTION = 'ADD_QUESTION',
	EDIT_QUESTION = 'EDIT_QUESTION',

	REFRESH_ADDED_QUESTION = 'REFRESH_ADDED_QUESTION',
	REFRESH_UPDATED_QUESTION = 'REFRESH_UPDATED_QUESTION',
	CLOSE_QUESTION_ADDING_FORM = 'CLOSE_QUESTION_ADDING_FORM',
	CANCEL_QUESTION_ADDING_FORM = 'CANCEL_ADDING_FORM'
}


type CategoriesPayload = {
	[ActionTypes.SET_CATEGORIES]: {
		categories: ICategory[];
	};

	[ActionTypes.SET_LOADING]: {
	};

	[ActionTypes.CANCEL_ADDING_FORM]: {
	};

	[ActionTypes.CANCEL_EDITING_FORM]: {
	};

	[ActionTypes.CLOSE_EDITING_FORM]: {
	};

	[ActionTypes.ADD]: IParentInfo;

	[ActionTypes.VIEW_CATEGORY_QUESTIONS]: {
		category: ICategory;
	};

	[ActionTypes.EDIT]: {
		category: ICategory;
	};

	[ActionTypes.REFRESH_UPDATED_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.DELETE]: {
		_id: Types.ObjectId;
	};

	[ActionTypes.CLEAN_SUB_TREE]: {
		category: ICategory;
	};

	[ActionTypes.CLOSE_EDITING_FORM]: {
	};

	[ActionTypes.CLOSE_ADDING_FORM]: {
	};

	[ActionTypes.REFRESH_ADDED_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.REFRESH_UPDATED_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.SET_ERROR]: {
		error: AxiosError;
	};

	/////////////
	// questions
	[ActionTypes.SET_CATEGORY_QUESTIONS]: {
		parentCategory: Types.ObjectId | null,
		questions: IQuestion[];
	};

	[ActionTypes.ADD_QUESTION]: {
		category: ICategory;
	}

	[ActionTypes.EDIT_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.REFRESH_UPDATED_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.DELETE]: {
		_id: Types.ObjectId;
	};

	[ActionTypes.REFRESH_ADDED_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.REFRESH_UPDATED_QUESTION]: {
		question: IQuestion;
	};

};

export type CategoriesActions =
	ActionMap<CategoriesPayload>[keyof ActionMap<CategoriesPayload>];
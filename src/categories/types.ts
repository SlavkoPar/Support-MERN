import { Types } from 'mongoose';

import { ActionMap, IDateAndBy } from '../global/types';
import { AxiosError } from 'axios';

export const Mode = {
	UNDEFINED: undefined,
	NULL: null,
	AddingCategory: 'AddingCategory',
	ViewingCategory: 'ViewingCategory',
	EditingCategory: 'EditingCategory',
	DeletingCategory: 'DeletingCategory',
	//////////////////////////////////////
	// questions
	AddingQuestion: 'AddingQuestion',
	ViewingQuestion: 'ViewingQuestion',
	EditingQuestion: 'EditingQuestion',
	DeletingQuestion: 'DeletingQuestion',
}

export enum FormMode {
	viewing,
	adding,
	editing
}

export interface IAnswer {
	_id?: Types.ObjectId
}

export interface IQuestion {
	_id?: Types.ObjectId,
	title: string,
	level: number,
	parentCategory: Types.ObjectId,
	words: string[],
	answers: IAnswer[],
	source: number,
	status: number,
	created?: IDateAndBy,
	createdBy?: string,
	modified?: IDateAndBy,
	modifiedBy?: string,
	inViewing?: boolean,
	inEditing?: boolean,
	inAdding?: boolean
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
	inViewing?: boolean,
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
	getSubCategories: ({ parentCategory, level }: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createCategory: (category: ICategory) => void,
	viewCategory: (_id: Types.ObjectId) => void,
	editCategory: (_id: Types.ObjectId) => void,
	updateCategory: (category: ICategory) => void,
	deleteCategory: (_id: Types.ObjectId) => void,
	//////////////
	// questions
	getCategoryQuestions: ({parentCategory, level}: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createQuestion: (question: IQuestion) => void,
	viewQuestion: (_id: Types.ObjectId) => void,
	editQuestion: (_id: Types.ObjectId) => void,
	updateQuestion:  (question: IQuestion) => void,
	deleteQuestion: (_id: Types.ObjectId) => void
}

export interface ICategoryFormProps {
	inLine: boolean;
	initialValues: ICategory;
	//isEdit: boolean;
	mode: FormMode;
	submitForm: (category: ICategory) => void,
	children: string
}

export interface IQuestionFormProps {
	initialValues: IQuestion;
	mode: FormMode;
	submitForm: (question: IQuestion) => void,
	children: string
  }

export enum ActionTypes {
	SET_LOADING = 'SET_LOADING',
	SET_CATEGORIES = 'SET_CATEGORIES',
	CLEAN_SUB_TREE = 'CLEAN_SUB_TREE',
	SET_ERROR = 'SET_ERROR',
	ADD_CATEGORY = 'ADD_CATEGORY',
	SET_CATEGORY = 'SET_CATEGORY',
	SET_CATEGORY_KEEP_MODE = 'SET_CATEGORY_KEEP_MODE',
	SET_ADDED_CATEGORY = 'SET_ADDED_CATEGORY',
	VIEW_CATEGORY = 'VIEW_CATEGORY',
	EDIT_CATEGORY = 'EDIT_CATEGORY',
	DELETE = 'DELETE',

	CLOSE_CATEGORY_FORM = 'CLOSE_CATEGORY_FORM',
	CANCEL_CATEGORY_FORM = 'CANCEL_CATEGORY_FORM',

	// questions
	ADD_QUESTION = 'ADD_QUESTION',
	VIEW_QUESTION = 'VIEW_QUESTION',
	EDIT_QUESTION = 'EDIT_QUESTION',

	SET_QUESTION = 'SET_QUESTION',
	DELETE_QUESTION = 'DELETE_QUESTION',

	CLOSE_QUESTION_FORM = 'CLOSE_QUESTION_FORM',
	CANCEL_QUESTION_FORM = 'CANCEL_QUESTION_FORM'
}


export type CategoriesPayload = {
	[ActionTypes.SET_LOADING]: undefined;

	[ActionTypes.SET_CATEGORIES]: {
		categories: ICategory[];
	};

	[ActionTypes.ADD_CATEGORY]: IParentInfo;

	[ActionTypes.VIEW_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.EDIT_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.SET_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.SET_CATEGORY_KEEP_MODE]: {
		category: ICategory;
	};


	[ActionTypes.SET_ADDED_CATEGORY]: {
		category: ICategory;
	};

	[ActionTypes.DELETE]: {
		_id: Types.ObjectId;
	};

	[ActionTypes.CLEAN_SUB_TREE]: {
		category: ICategory;
	};

	[ActionTypes.CLOSE_CATEGORY_FORM]: undefined;

	[ActionTypes.CANCEL_CATEGORY_FORM]: undefined;

	[ActionTypes.SET_ERROR]: {
		error: AxiosError;
	};

	/////////////
	// questions

	[ActionTypes.ADD_QUESTION]: {
		category: ICategory;
	}

	[ActionTypes.VIEW_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.EDIT_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.SET_QUESTION]: {
		question: IQuestion;
	};

	[ActionTypes.DELETE_QUESTION]: {
		_id: Types.ObjectId;
	};

	[ActionTypes.CLOSE_QUESTION_FORM]: {
		question: IQuestion;
	};

	[ActionTypes.CANCEL_QUESTION_FORM]: {
		question: IQuestion;
	};

};

export type CategoriesActions =	
	ActionMap<CategoriesPayload>[keyof ActionMap<CategoriesPayload>];

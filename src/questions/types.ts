import { Types } from 'mongoose';

import { IDateAndBy } from '../global/types';
import { AxiosError } from 'axios';
import { ActionMap } from '../global/types'

export const FORM_MODES = {
	UNDEFINED: undefined,
	NULL: null,
	ADD: 'ADD',
	EDIT: 'EDIT',
	DELETE: 'DELETE'
}

export interface IQuestion {
	_id?: Types.ObjectId,
	title: string,
	level: number,
	parentCategory: Types.ObjectId,
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

export interface IQuestionsState {
	mode: string | null,
	loading: boolean,
	questions: IQuestion[],
	error?: AxiosError;
}

export interface IQuestionsContext {
	state: IQuestionsState,
	getQuestions: ({parentCategory, level}: { parentCategory: Types.ObjectId | null, level: number }) => void,
	createQuestion: (question: IQuestion) => void,
	editQuestion: (_id: Types.ObjectId) => void,
	updateQuestion:  (question: IQuestion) => void,
	deleteQuestion: (_id: Types.ObjectId) => void
}

export interface IQuestionFormProps {
	initialValues: IQuestion;
	isEdit: boolean;
	submitForm: (question: IQuestion) => void,
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


  type QuestionsPayload = {
	[ActionTypes.SET_CATEGORIES]: {
	  questions: IQuestion[];
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
  
	[ActionTypes.EDIT]: {
	  question: IQuestion;
	};
  
	[ActionTypes.REFRESH_UPDATED_CATEGORY]: {
	  question: IQuestion;
	};
  
	[ActionTypes.DELETE]: {
	  _id: Types.ObjectId;
	};
  
	[ActionTypes.CLEAN_SUB_TREE]: {
	  question: IQuestion;
	};
	
	[ActionTypes.CLOSE_EDITING_FORM]: {
	};
  
	[ActionTypes.CLOSE_ADDING_FORM]: {
	};
  
	[ActionTypes.REFRESH_ADDED_CATEGORY]: {
	  question: IQuestion;
	};
  
	[ActionTypes.REFRESH_UPDATED_CATEGORY]: {
	  question: IQuestion;
	};
  
	[ActionTypes.SET_ERROR]: {
	  error: AxiosError;
	};
  };
  
  export type QuestionsActions = 
  	ActionMap<QuestionsPayload>[keyof ActionMap<QuestionsPayload>];

import { ActionMap } from '../global/types'
import { FORM_MODES, ActionTypes, IQuestionsState, IQuestion, IParentInfo, QuestionsActions } from "./types";
import { Types } from 'mongoose';
import { AxiosError } from "axios";

export const initialQuestion: IQuestion = {
  // temp _id for inAdding, to server as list key
  // it will be removed on submitForm
  // real _id will be given by the MongoDB 
  _id: new Types.ObjectId('000000000000000000000000'),
  title: '',
  level: 0,
  parentQuestion: null
}


export const reducer = (state: IQuestionsState, action: QuestionsActions) => {
  switch (action.type) {

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.SET_CATEGORIES: {
      console.log(state.questions)
      console.log(action.payload.questions)
      return {
        ...state,
        questions: state.questions.concat(action.payload.questions),
        loading: false
      };
    }

    case ActionTypes.CLEAN_SUB_TREE: {
      const { _id } = action.payload.question;
      const arr = markForClean(state.questions, _id!)
      console.log('clean:', arr)
      const _ids = arr.map(c => c._id)
      return {
        ...state,
        questions: state.questions.filter(c => !_ids.includes(c._id))
      }
    }

    case ActionTypes.SET_ERROR: {
      const {error} = action.payload;
      return { ...state, error, loading: false };
    }

    case ActionTypes.ADD: {
      const { parentQuestion, level } = action.payload;
      const questions: IQuestion[] = [
        {
          ...initialQuestion,
          title: '',
          level: level + 1,
          parentQuestion,
          inAdding: true
        },
        ...state.questions
      ]
      console.log('ADD', questions)
      return {
        ...state,
        mode: FORM_MODES.ADD,
        questions
      };
    }

    case ActionTypes.REFRESH_ADDED_CATEGORY: {
      console.log('REFRESH_ADDED_CATEGORY', state.questions)
      const { question } = action.payload;
      return {
        ...state,
        questions: state.questions.map(c => c.inAdding ? question : c),
        loading: false
      }
    }

    case ActionTypes.REFRESH_UPDATED_CATEGORY: {
      const { question } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.NULL,
        question: null,
        questions: state.questions.map(c => c.inEditing ? question : c), // doesn't contain isEditing 
        loading: false
      }
    }

    case ActionTypes.EDIT: {
      const { question } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.EDIT,
        question,
        questions: state.questions.map(c => c._id === question._id
          ? { ...question, inEditing: true }
          : c
        ),
        loading: false
      };
    }

    case ActionTypes.DELETE: {
      const {_id} = action.payload;
      return {
        ...state,
        mode: FORM_MODES.NULL,
        question: null,
        questions: state.questions.filter(c => c._id !== _id)
      };
    }

    case ActionTypes.CLOSE_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        question: null
      };
    }

    case ActionTypes.CANCEL_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        question: null,
        questions: state.questions.filter(c => !c.inAdding)
      };
    }

    case ActionTypes.CANCEL_EDITING_FORM:
    case ActionTypes.CLOSE_EDITING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        question: null,
        questions: state.questions.map(c => c.inEditing ? ({ ...c, inEditing: false }) : c)
      };
    }
    
    default:
      return state;
  }
};

function markForClean(questions: IQuestion[], parent_id: Types.ObjectId) {
  let arr = questions
    .filter(question => question.parentQuestion === parent_id)

  arr.forEach(question => {
    arr = arr.concat(markForClean(questions, question._id!))
  })
  return arr
}

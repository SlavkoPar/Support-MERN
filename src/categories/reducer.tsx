
import { ActionMap } from '../global/types'
import { FORM_MODES, ActionTypes, ICategoriesState, ICategory, IParentInfo, CategoriesActions } from "./types";
import { Types } from 'mongoose';
import { AxiosError } from "axios";

export const initialCategory: ICategory = {
  // temp _id for inAdding, to server as list key
  // it will be removed on submitForm
  // real _id will be given by the MongoDB 
  _id: new Types.ObjectId('000000000000000000000000'),
  title: '',
  level: 0,
  parentCategory: null
}


export const reducer = (state: ICategoriesState, action: CategoriesActions) => {
  switch (action.type) {

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.SET_CATEGORIES: {
      return {
        ...state,
        categories: state.categories.concat(action.payload.categories),
        loading: false
      };
    }

    case ActionTypes.CLEAN_SUB_TREE: {
      const { _id } = action.payload.category;
      const arr = markForClean(state.categories, _id!)
      console.log('clean:', arr)
      const _ids = arr.map(c => c._id)
      return {
        ...state,
        categories: state.categories.filter(c => !_ids.includes(c._id))
      }
    }

    case ActionTypes.SET_ERROR: {
      const {error} = action.payload;
      return { ...state, error, loading: false };
    }

    case ActionTypes.ADD: {
      const { parentCategory, level } = action.payload;
      const categories: ICategory[] = [
        {
          ...initialCategory,
          title: '',
          level: level + 1,
          parentCategory,
          inAdding: true
        },
        ...state.categories
      ]
      console.log('ADD', categories)
      return {
        ...state,
        mode: FORM_MODES.ADD,
        categories
      };
    }

    case ActionTypes.REFRESH_ADDED_CATEGORY: {
      console.log('REFRESH_ADDED_CATEGORY', state.categories)
      const { category } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c.inAdding ? category : c),
        loading: false
      }
    }

    case ActionTypes.REFRESH_UPDATED_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.NULL,
        category: null,
        categories: state.categories.map(c => c.inEditing ? category : c), // doesn't contain isEditing 
        loading: false
      }
    }

    case ActionTypes.EDIT: {
      const { category } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.EDIT,
        category,
        categories: state.categories.map(c => c._id === category._id
          ? { ...category, inEditing: true }
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
        category: null,
        categories: state.categories.filter(c => c._id !== _id)
      };
    }

    case ActionTypes.CLOSE_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        category: null
      };
    }

    case ActionTypes.CANCEL_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        category: null,
        categories: state.categories.filter(c => !c.inAdding)
      };
    }

    case ActionTypes.CANCEL_EDITING_FORM:
    case ActionTypes.CLOSE_EDITING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        category: null,
        categories: state.categories.map(c => c.inEditing ? ({ ...c, inEditing: false }) : c)
      };
    }
    
    default:
      return state;
  }
};

function markForClean(categories: ICategory[], parent_id: Types.ObjectId) {
  let arr = categories
    .filter(category => category.parentCategory === parent_id)

  arr.forEach(category => {
    arr = arr.concat(markForClean(categories, category._id!))
  })
  return arr
}

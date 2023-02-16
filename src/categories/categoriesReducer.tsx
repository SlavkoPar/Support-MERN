import { ActionTypes, ICategoriesState, ICategory } from "./types";
import { Schema, Types } from 'mongoose';
import { AxiosError } from "axios";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  }
};


type CategoriesPayload = {
  [ActionTypes.SET_CATEGORIES]: {
    categories: ICategory[];
  };

  [ActionTypes.SET_LOADING]: {
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
    error: Error | AxiosError;
  };
};

export type CategoriesActions = ActionMap<CategoriesPayload>[keyof ActionMap<CategoriesPayload>];


export const categoriesReducer = (state: ICategoriesState, action: CategoriesActions) => {
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
    //   case Types.Delete:
    //     return [...state.filter(product => product.id !== action.payload.id)];
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

/*
function categoryReducer(state, action) {
    console.log('action.type', action.type)
    switch (action.type) {
      case ActionTypes.SET_LOADING: {
        return { ...state, loading: true };
      }
  
      case ActionTypes.SET_CATEGORIES: {
        return {
          ...state,
          categories: state.categories.concat(action.categories),
          loading: false
        };
      }
  
      case ActionTypes.CLEAN_SUB_TREE: {
        const { _id } = action.category;
        const arr = markForClean(state.categories, _id)
        console.log('clean:', arr)
        const _ids = arr.map(c => c._id)
        return {
          ...state,
          categories: state.categories.filter(c => !_ids.includes(c._id))
        }
      }
  
      case ActionTypes.SET_ERROR: {
        return { ...state, error: action.payload, loading: false };
      }
  
      case ActionTypes.ADD: {
        const { category, createdBy } = action;
        const categories = [
          {
            ...initialCategory,
            level: category.level + 1,
            parentCategory: category._id,
            createdBy,
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
        const { data } = action;
        return {
          ...state,
          categories: state.categories.map(c => c.inAdding ? data : c),
          loading: false
        }
      }
  
      case ActionTypes.REFRESH_UPDATED_CATEGORY: {
        const { category } = action;
        return {
          ...state,
          mode: FORM_MODES.NULL,
          category: null,
          categories: state.categories.map(c => c.inEditing ? category : c), // doesn't contain isEditing 
          loading: false
        }
      }
  
  
      case ActionTypes.EDIT: {
        const { category } = action;
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
        const _id = action._id;
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
  
  
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
}
*/
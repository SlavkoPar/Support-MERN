import { FORM_MODES, ActionTypes, ICategoriesState, ICategory, IParentInfo, CategoriesActions } from "./types";
import { Types } from 'mongoose';
import { IQuestion } from "./types";

export const initialQuestion: IQuestion = {
  // temp _id for inAdding, to server as list key
  // it will be removed on submitForm
  // real _id will be given by the MongoDB 
  parentCategory: new Types.ObjectId('000000000000000000000000'),
  _id: new Types.ObjectId('000000000000000000000000'),
  title: '',
  level: 0,
  words: [],
	answers: [],
	source: 0,
	status: 0
}



export const initialCategory: ICategory = {
  // temp _id for inAdding, to server as list key
  // it will be removed on submitForm
  // real _id will be given by the MongoDB 
  _id: new Types.ObjectId('000000000000000000000000'),
  title: '',
  level: 0,
  parentCategory: null,
  questions: []
}


export const reducer = (state: ICategoriesState, action: CategoriesActions) => {
  switch (action.type) {

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.SET_CATEGORIES: {
      console.log(state.categories)
      console.log(action.payload.categories)
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
        categories: state.categories.map(c => c.inEditing ? category : c), // doesn't contain isEditing 
        loading: false
      }
    }

    case ActionTypes.VIEW_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        category,
        categories: state.categories.map(c => c._id === category._id
          ? { ...category, inViewing: true } // category.questions are inside of object
          : { ...c, inViewing: false }
        ),
        mode: FORM_MODES.VIEW,
        loading: false
      };
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
        categories: state.categories.filter(c => c._id !== _id)
      };
    }
    
    case ActionTypes.CANCEL_FORM:
     case ActionTypes.CLOSE_FORM: {
        return {
          ...state,
          mode: FORM_MODES.NULL,
          categories: state.categories.map(c => ({ ...c, inViewing: false, inEditing: false, inAdding: false, }))
        };
      }


    case ActionTypes.ADD_QUESTION: {
      const { category } = action.payload;
      const {_id, level } = category;
      const question: IQuestion = {
        ...initialQuestion,
        parentCategory: _id!,
        level,
        title : 'New Product'
      }
      return {
        ...state,
        categories: state.categories.map(c => c._id === _id
          ? { ...c, questions: [...c.questions??[], question], inAdding: true}
          : c),
        mode: FORM_MODES.ADD_QUESTION
      };
    }

    case ActionTypes.SET_CATEGORY_QUESTIONS: {
      const { parentCategory, questions } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c._id === parentCategory // TODO what if null
          ? { ...c, questions }
          : c)
      };
    }

    // case ActionTypes.REFRESH_ADDED_QUESTION: {
    //   console.log('REFRESH_ADDED_QUESTION', state.categories)
    //   const { question } = action.payload;
    //   return {
    //     ...state,
    //     categories: state.categories.map(c => c.inAdding ? { ...c, questions: [...c.questions, question], inAdding: false } : c),
    //     loading: false
    //   }
    // }

    case ActionTypes.VIEW_QUESTION: {
      const { question } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.VIEW_QUESTION,
        categories: state.categories.map(c => c._id === question.parentCategory
          ? { ...c, 
              questions: c.questions.map(q => q._id === question._id ? {
                ...question,
                inViewing: true
              } : q),
            inViewing: true }
          : c
        ),
        loading: false
      };
    }

    case ActionTypes.EDIT_QUESTION: {
      const { question } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.EDIT_QUESTION,
        categories: state.categories.map(c => c._id === question.parentCategory
          ? { ...c, 
            questions: c.questions.map(q => q._id === question._id ? {...question, inEditing: true} : q),
            inEditing: true }
          : c
        ),
        loading: false
      };
    }

    /*
    case ActionTypes.REFRESH_QUESTION: {
      const { question } = action.payload;
      return {
        ...state,
        //mode: FORM_MODES.EDIT_QUESTION,
        categories: state.categories.map(c => c._id === question.parentCategory
          ? { 
            ...c, 
            questions: c.questions.map(q => q._id === question._id ? question : q,
              in??????
          }
          : c
        ),
        loading: false
      };
    }
    */

    default:
      return state;  // TODO throw error
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

import { FormModes, ActionTypes, ICategoriesState, ICategory, IParentInfo, CategoriesActions } from "./types";
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
  _id: new Types.ObjectId("000000000000000000000000"),
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
      const { categories } = action.payload;
      console.log(state.categories, 'Payload categories: ', categories, state.categories.concat(categories) )
      return {
        ...state,
        categories: state.categories.concat(categories),
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
      const { error } = action.payload;
      return { ...state, error, loading: false };
    }

    case ActionTypes.ADD_CATEGORY: {
      const { parentCategory, level } = action.payload;
      const category: ICategory = {
        ...initialCategory,
        title: 'New Category',
        level: level + 1,
        parentCategory,
        inAdding: true
      }
      return {
        ...state,
        categories: [category, ...state.categories],
        mode: FormModes.AddingCategory
      };
    }

    case ActionTypes.SET_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        mode: FormModes.NULL,
        //categories: state.categories.map(c => c.inEditing || c.inAdding ? category : c), 
        categories: state.categories.map(c => c._id === category._id ? category : c), // category doesn't contain inViewving, inEditing, inAdding 
        loading: false
      }
    }

    case ActionTypes.VIEW_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c._id === category._id
          ? { ...category, inViewing: true } // category.questions are inside of object
          : { ...c, inViewing: false }
        ),
        mode: FormModes.ViewingCategory,
        loading: false
      };
    }

    case ActionTypes.EDIT_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c._id === category._id
          ? { ...category, inEditing: true }
          : c
        ),
        mode: FormModes.EditingCategory,
        loading: false
      };
    }

    case ActionTypes.DELETE: {
      const { _id } = action.payload;
      return {
        ...state,
        mode: FormModes.NULL,
        categories: state.categories.filter(c => c._id !== _id)
      };
    }

    case ActionTypes.CANCEL_FORM:
    case ActionTypes.CLOSE_FORM: {
      return {
        ...state,
        mode: FormModes.NULL,
        categories: state.categories.map(c => ({ ...c, inViewing: false, inEditing: false, inAdding: false, }))
      };
    }


    case ActionTypes.ADD_QUESTION: {
      const { category } = action.payload;
      const { _id, level } = category;
      const question: IQuestion = {
        ...initialQuestion,
        parentCategory: _id!,
        level,
        title: 'New Product'
      }
      return {
        ...state,
        categories: state.categories.map(c => c._id === _id
          ? { ...c, questions: [...c.questions ?? [], question], inAdding: true }
          : c),
        mode: FormModes.AddingQuestion
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
        categories: state.categories.map(c => c._id === question.parentCategory
          ? {
            ...c,
            questions: c.questions.map(q => q._id === question._id ? {
              ...question,
              inViewing: true
            }
              : {
                ...q,
                inViewing: false
              }),
            inViewing: true
          }
          : {
            ...c,
            inViewing: false
          }
        ),
        mode: FormModes.ViewingQuestion,
        loading: false
      }
    }

    case ActionTypes.SET_QUESTION:
      const { question } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c._id === question.parentCategory
          ? {
            ...c,
            questions: c.questions.map(q => q._id === question._id ? {
              ...question
            }
              : {
                ...q,
              }),
          }
          : {
            ...c,
          }
        ),
        mode: FormModes.NULL,
        loading: false
      };

    case ActionTypes.EDIT_QUESTION: {
      const { question } = action.payload;
      return {
        ...state,
        categories: state.categories.map(c => c._id === question.parentCategory
          ? {
            ...c,
            questions: c.questions.map(q => q._id === question._id ? {
              ...question,
              inEditing: true
            }
              : {
                ...q,
                inEditing: false
              }),
            inEditing: true
          }
          : {
            ...c,
            inEditing: false
          }
        ),
        mode: FormModes.EditingQuestion,
        loading: false
      };
    }


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

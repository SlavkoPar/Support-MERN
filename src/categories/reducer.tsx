import { Mode, ActionTypes, ICategoriesState, ICategory, IParentInfo, CategoriesActions } from "./types";
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
      console.log(state.categories, 'Payload categories: ', categories, state.categories.concat(categories))
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
        mode: Mode.AddingCategory
      };
    }

    case ActionTypes.SET_ADDED_CATEGORY: {
      const { category } = action.payload;
      // category doesn't contain inViewving, inEditing, inAdding 
      return {
        ...state,
        categories: state.categories.map(c => c.inAdding ? category : c),
        mode: Mode.NULL,
        loading: false
      }
    }

    case ActionTypes.SET_CATEGORY: {
      const { category } = action.payload;
      // category doesn't contain inViewving, inEditing, inAdding 
      return {
        ...state,
        categories: state.categories.map(c => c._id === category._id ? category : c),
        mode: Mode.NULL,
        loading: false
      }
    }

    case ActionTypes.SET_CATEGORY_KEEP_MODE: { //  TODO avoid: , inAdding: c.inAdding
      const { category } = action.payload;
      const cat = state.categories.find(c => c._id === category._id)
      const questionInAdding = cat!.questions?.find(q => q.inAdding);
      // category doesn't contain inViewing, inEditing, inAdding 
      return {
        ...state,
        categories: state.categories.map(c => c._id === category._id
          ? { 
            ...category, 
            questions: questionInAdding ? [questionInAdding!, ...category.questions] : category.questions, 
            inAdding: c.inAdding 
          }
          : c
        ),
        // mode: Mode.NULL,  keep mode
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
        mode: Mode.ViewingCategory,
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
        mode: Mode.EditingCategory,
        loading: false
      };
    }

    case ActionTypes.DELETE: {
      const { _id } = action.payload;
      return {
        ...state,
        mode: Mode.NULL,
        categories: state.categories.filter(c => c._id !== _id)
      };
    }

    case ActionTypes.CANCEL_CATEGORY_FORM:
    case ActionTypes.CLOSE_CATEGORY_FORM: {
      const categories = state.mode === Mode.AddingCategory
        ? state.categories.filter(c => !c.inAdding)
        : state.categories
      return {
        ...state,
        mode: Mode.NULL,
        categories: categories.map(c => ({ ...c, inViewing: false, inEditing: false, inAdding: false }))
      };
    }

    case ActionTypes.ADD_QUESTION: {
      const { category } = action.payload;
      const { _id, level } = category;
      const question: IQuestion = {
        ...initialQuestion,
        parentCategory: _id!,
        level,
        title: 'New Question',
        inAdding: true
      }
      return {
        ...state,
        categories: state.categories.map(c => c._id === _id
          ? { ...c, questions: [...c.questions ?? [], question], inAdding: true }
          : c),
        mode: Mode.AddingQuestion
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
        mode: Mode.ViewingQuestion,
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
        mode: Mode.NULL,
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
        mode: Mode.EditingQuestion,
        loading: false
      };
    }

    case ActionTypes.CANCEL_QUESTION_FORM:
    case ActionTypes.CLOSE_QUESTION_FORM: {
      let questions: IQuestion[] = [];
      if (state.mode === Mode.AddingQuestion) { 
        const category = state.categories.find(c => c.inAdding)
        questions = category!.questions.filter(q => !q.inAdding)
      }
      else if (state.mode === Mode.ViewingQuestion) {
        const category = state.categories.find(c => c.inViewing)
        questions = category!.questions.map(q => q.inViewing
          ? { ...q, inViewing: false }
          : q)
          console.log('ARGH VIEWING', questions)
      }
      else if (state.mode === Mode.EditingQuestion) {
        const category = state.categories.find(c => c.inEditing)
        questions = category!.questions.map(q => q.inEditing
          ? { ...q, inEditing: false }
          : q)
          console.log('ARGH EDITING', questions)
      }
      return {
        ...state,
        categories: state.categories.map(c => c.inAdding || c.inViewing || c.inEditing
          ? { ...c, questions, inAdding: false, inEditing: false, inViewing: false }
          : c
        ),
        mode: Mode.NULL,
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

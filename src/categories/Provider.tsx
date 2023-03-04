import { createContext, useContext, useState, useReducer, useEffect, useCallback, Dispatch } from 'react';
import { Types } from 'mongoose';
import { hostPort } from '../global/GlobalProvider'
import { ActionTypes, FORM_MODES, ICategory, ICategoriesState, ICategoriesContext, IParentInfo, CategoriesActions, CategoriesPayload, FormMode } from './types';
import { reducer } from './reducer';
import axios, { AxiosError } from "axios";
import { IQuestion } from './types';
import { ActionMap } from '../global/types';

const initialState: ICategoriesState = {
  mode: FORM_MODES.NULL, // TODO provjeri ove MODESSSSSSSSSSSSSSSSSSSSS 
  loading: false,
  categories: []
}

const CategoriesContext = createContext<ICategoriesContext>({} as any);
const CategoryDispatchContext = createContext<Dispatch<any>>(() => null);

type Props = {
  children: React.ReactNode
}

export const Provider: React.FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const getSubCategories = useCallback(({ parentCategory, level }: IParentInfo) => {
    const urlCategories = `${hostPort}/categories/${parentCategory}`
    console.log('FETCHING --->>> getCategories', level, parentCategory)
    dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(urlCategories)
      .then(({ data }) => {
        dispatch({ type: ActionTypes.SET_CATEGORIES, payload: { categories: data } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const createCategory = useCallback((category: ICategory) => {
    dispatch({ type: ActionTypes.SET_LOADING }) // TODO treba li ovo 
    axios
      .post(`${hostPort}/categories/create-category`, category)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('Category successfully created')
          dispatch({ type: ActionTypes.REFRESH_ADDED_CATEGORY, payload: { category: data } });
          dispatch({ type: ActionTypes.CLOSE_FORM })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: {
              error: new AxiosError('Status is not 200 status:' + status)
            }
          })
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  // it is the sam3 as editCategory but with readonly CategoyForm
  const viewCategory = useCallback((_id: Types.ObjectId) => {
    const url = `${hostPort}/categories/get-category/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data: category }) => {
        console.log(category)
        dispatch({ type: ActionTypes.VIEW_CATEGORY, payload: { category } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const editCategory = useCallback((_id: Types.ObjectId) => {
    const url = `${hostPort}/categories/get-category/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data: category }) => {
        console.log(category)
        dispatch({ type: ActionTypes.EDIT, payload: { category } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);


  const updateCategory = useCallback((category: ICategory) => {
    dispatch({ type: ActionTypes.SET_LOADING })
    const url = `${hostPort}/categories/update-category/${category._id}`
    console.log(`UPDATING --->>> ${url}`)
    axios
      .put(url, category)
      .then(({ status, data: category }) => {
        if (status === 200) {
          console.log("Category successfully updated");
          dispatch({ type: ActionTypes.REFRESH_UPDATED_CATEGORY, payload: { category } });
          dispatch({ type: ActionTypes.CLOSE_FORM })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: { error: new AxiosError('Status is not 200 status:' + status) }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const deleteCategory = (_id: Types.ObjectId) => {
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .delete(`${hostPort}/categories/delete-category/${_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log("Category successfully deleted");
          dispatch({ type: ActionTypes.DELETE, payload: { _id } });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  };

  /////////////
  // Questions
  //
  /*const getQuestions = useCallback(({ parentCategory, level }: IParentInfo) => {
    const urlQuestions = `${hostPort}/questions/${parentCategory}`
    console.log('FETCHING --->>> getQuestions', level, parentCategory)
    dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(urlQuestions)
      .then(({ data }) => {
        dispatch({ type: ActionTypes.SET_CATEGORY_QUESTIONS, payload: { parentCategory, questions: data.fromQuestions } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);
  */

  const getCategoryQuestions = useCallback(({parentCategory:_id, level}: { parentCategory: Types.ObjectId | null, level: number }) => {
    const url = `${hostPort}/categories/get-category/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data: category }) => {
        console.log(category)
        dispatch({ type: ActionTypes.VIEW_CATEGORY, payload: { category } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);
 
  const createQuestion = useCallback((question: IQuestion) => {
    dispatch({ type: ActionTypes.SET_LOADING }) // TODO treba li ovo 
    axios
      .post(`${hostPort}/questions/create-question`, question)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('Question successfully created')
          dispatch({ type: ActionTypes.REFRESH_QUESTION, payload: { question: data } }); // ActionTypes.REFRESH_ADDED_QUESTION
          // TODO setting inAdding: false will close the form
          //dispatch({ type: ActionTypes.CLOSE_QUESTION_ADDING_FORM })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: {
              error: new AxiosError('Status is not 200 status:' + status)
            }
          })
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  
  const getQuestion = (_id: Types.ObjectId, actionType: ActionTypes.VIEW_QUESTION | ActionTypes.EDIT_QUESTION) => {  // keyof ActionMap<CategoriesPayload>
    const url = `${hostPort}/questions/get-question/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data }) => {
        const question: IQuestion = data;
        console.log(question)
        dispatch({ type: actionType, payload: { question } });
      })
      .catch((error) => { 
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  };

  const viewQuestion = useCallback((_id: Types.ObjectId) => {
    getQuestion(_id,  ActionTypes.VIEW_QUESTION);
  }, []);

  const editQuestion = useCallback((_id: Types.ObjectId) => {
        getQuestion(_id,  ActionTypes.EDIT_QUESTION);
  }, []);

  const updateQuestion = useCallback((question: IQuestion) => {
    dispatch({ type: ActionTypes.SET_LOADING })
    const url = `${hostPort}/questions/update-question/${question._id}`
    console.log(`UPDATING --->>> ${url}`)
    axios
      .put(url, question)
      .then(({ status, data: question }) => {
        if (status === 200) {
          console.log("Question successfully updated");
          dispatch({ type: ActionTypes.REFRESH_QUESTION, payload: { question } });
          dispatch({ type: ActionTypes.CLOSE_FORM })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: { error: new AxiosError('Status is not 200 status:' + status) }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const deleteQuestion = (_id: Types.ObjectId) => {
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .delete(`${hostPort}/questions/delete-question/${_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log("Question successfully deleted");
          dispatch({ type: ActionTypes.DELETE, payload: { _id } });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  };

  const contextValue: ICategoriesContext = { state: state, 
    getSubCategories, createCategory, viewCategory: viewCategory, editCategory, updateCategory, deleteCategory,
    getCategoryQuestions, createQuestion, viewQuestion, editQuestion, updateQuestion, deleteQuestion
  }
  return (
    <CategoriesContext.Provider value={contextValue}>
      <CategoryDispatchContext.Provider value={dispatch}>
        {children}
      </CategoryDispatchContext.Provider>
    </CategoriesContext.Provider>
  );
}

export function useCategoryContext() {
  return useContext(CategoriesContext);
}

export const useCategoryDispatch = () => {
  return useContext(CategoryDispatchContext)
};


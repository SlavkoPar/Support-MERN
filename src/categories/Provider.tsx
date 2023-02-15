import { createContext, useContext, useState, useReducer, useEffect, useCallback, Dispatch } from 'react';
import { Schema } from 'mongoose';
import { ActionTypes, FORM_MODES, ICategory, ICategoriesState, ICategoriesState2 } from './types';
import { categoriesReducer } from './categoriesReducer';
import axios, { AxiosError } from "axios";

const initialState: ICategoriesState = {
  mode: FORM_MODES.NULL,
  category: null,
  loading: false,
  categories: []
}

const CategoryContext = createContext<ICategoriesState2>({
  store: {...initialState},
  getCategories: ({parentCategory, level}: { parentCategory: Schema.Types.ObjectId, level: number }) => {}, 
  createCategory: (category: ICategory) => {},
	editCategory: (_id: Schema.Types.ObjectId) => {},
	updateCategory:  (category: ICategory) => {},
	deleteCategory: (_id: Schema.Types.ObjectId) => {}
});

const CategoryDispatchContext = createContext<Dispatch<any>>(() => null);

const configHost: string | undefined = process.env.REACT_APP_HOST;
const configPort: string | undefined = process.env.REACT_APP_PORT;
export const hostPort = `${configHost!}:${configPort!}`
console.log({hostPort})

type Props = {
  children: React.ReactNode
}

export const Provider: React.FC<Props> = ({ children }) => {

  const [store, dispatch] = useReducer(categoriesReducer, initialState);

  const getCategories = useCallback(({parentCategory, level}: { parentCategory: Schema.Types.ObjectId, level: number }) => {
    const urlCategories = `${hostPort}/categories/${parentCategory}`
    console.log('FETCHING --->>> getCategories', level, parentCategory)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    axios
      .get(urlCategories)
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: ActionTypes.SET_CATEGORIES, payload: { categories: data} });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const createCategory = useCallback((category: ICategory) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} }) // TODO treba li ovo 
    axios
      .post(`${hostPort}/categories/create-category`, category)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('Category successfully created')
          dispatch({ type: ActionTypes.REFRESH_ADDED_CATEGORY, payload: data });
          dispatch({ type: ActionTypes.CLOSE_ADDING_FORM, payload: {} })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({ type: ActionTypes.SET_ERROR, payload: { error: new Error('Status is not 200' +  status) } });
          // { code: '', message: ''}
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const editCategory = useCallback((_id: Schema.Types.ObjectId) => {
    const url = `${hostPort}/categories/get-category/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
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
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    const url = `${hostPort}/categories/update-category/${category._id}`
    console.log(`UPDATING --->>> ${url}`)
    axios
      .put(url, category)
      .then(({ status, data: category }) => {
        if (status === 200) {
          console.log("Category successfully updated");
          dispatch({ type: ActionTypes.REFRESH_UPDATED_CATEGORY, payload: { category }});
          dispatch({ type: ActionTypes.CLOSE_EDITING_FORM, payload: {}   })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({ 
            type: ActionTypes.SET_ERROR,
            payload: { error: new Error() }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const deleteCategory = (_id: Schema.Types.ObjectId) => {
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .delete(`${hostPort}/categories/delete-category/${_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log("Category successfully deleted");
          dispatch({ type: ActionTypes.DELETE, payload: {_id} });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  };

  /*
  const refreshAddedCategory = useCallback(_id => {
    const url = `${hostPort}/categories/get-category/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: ActionTypes.REFRESH_ADDED_CATEGORY, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);
  */

  return (
    <CategoryContext.Provider value={{ store, getCategories, createCategory, editCategory, updateCategory, deleteCategory }}>
      <CategoryDispatchContext.Provider value={dispatch}>
        {children}
      </CategoryDispatchContext.Provider>
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  return useContext(CategoryContext);
}

export const useCategoryDispatch = () => {
  return useContext(CategoryDispatchContext)
};



export const initialCategory = {
  _id: 'for_list_key_mongo_given', // just for list key, real _id will given by the MongoDB 
  name: '',
  level: 0,
  created: null,
  createdBy: null,
  modified: null,
  modifiedBy: null,
  parentCategory: null
}


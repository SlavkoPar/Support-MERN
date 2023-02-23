import React, { createContext, useContext, useReducer, Dispatch, useCallback } from "react";
import { Types } from 'mongoose';

import { globalReducer, GlobalActions } from "./reducer";

import { IGlobalContext, IGlobalState, ILoginUser, ROLES, GlobalActionTypes } from './types'
import axios, { AxiosError } from "axios";
import { IUser } from "../users/types";

const initialState: IGlobalState = {
  isAuthenticated: false,
  authUser: {
    userId: new Types.ObjectId('63ef5e1813d8ce86929c61be'),
    color: 'blue',
    userName: '',
    role: ROLES.VIEWER,
  },
  canEdit: false,
  isDarkMode: true,
  variant: 'dark',
  bg: 'dark',
  loading: false
}

const GlobalContext = createContext<IGlobalContext>({
  globalState: { ...initialState },
  registerUser: (user: ILoginUser) => { },
  signInUser: (user: ILoginUser) => { },
});

const GlobalDispatchContext = createContext<Dispatch<any>>(() => null);

interface Props {
  children: React.ReactNode
}

const configHost: string | undefined = process.env.REACT_APP_HOST;
const configPort: string | undefined = process.env.REACT_APP_PORT;
export const hostPort = `${configHost!}:${configPort!}`
console.log({ hostPort })

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [globalState, dispatch] = useReducer(globalReducer, initialState);

  const registerUser = useCallback((loginUser: ILoginUser) => {
    dispatch({ type: GlobalActionTypes.SET_LOADING, payload: {} }) // TODO treba li ovo 
    const user: IUser = {
      ...loginUser,
      level: 0,
      parentUser: null,
      role: ROLES.VIEWER,
      created: {
        date: new Date(),
        by: {
          userId: new Types.ObjectId() //globalStore.authUser.userId
        }
      }
    }
    axios
      .post(`${hostPort}/users/register-user`, user)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('User successfully registered')
          dispatch({ type: GlobalActionTypes.AUTHENTICATE, payload: { user } })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: GlobalActionTypes.SET_ERROR, payload: {
              error: new AxiosError('Status is not 200 status: ' + status)
            }
          })
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: GlobalActionTypes.SET_ERROR,
          payload: {
            error: new AxiosError(error?.response?.data, error)
          }
        });
      });
  }, [dispatch]);


  const signInUser = useCallback((loginUser: ILoginUser) => {
    dispatch({ type: GlobalActionTypes.SET_LOADING, payload: {} }) // TODO treba li ovo 
    axios
      .post(`${hostPort}/users/sign-in-user`, { ...loginUser, date: new Date() })
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('User successfully logged in')
          dispatch({ type: GlobalActionTypes.AUTHENTICATE, payload: { user: data } })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: GlobalActionTypes.SET_ERROR, payload: {
              error: new AxiosError('Status is not 200 status: ' + status)
            }
          })
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: GlobalActionTypes.SET_ERROR,
          payload: {
            error: new AxiosError(error?.response?.data, error)
          }
        });
      });
  }, [dispatch]);



  return (
    <GlobalContext.Provider value={{ globalState, registerUser, signInUser }}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export const useGlobalDispatch = () => {
  return useContext(GlobalDispatchContext)
};

export const useGlobalState = () => {
  const { globalState } = useGlobalContext()
  return globalState;
}

// const storeReducer: React.Reducer<IGlobalState, GlobalActions> = (state, action) => {
//   switch (action.type) {
//     case GlobalActions.AUTHENTICATE: {
//       return { ...state, isAuthenticated: true, user: action.user };
//     }
//     default: {
//       throw Error('Unknown action: ' + action.type);
//     }
//   }
// }




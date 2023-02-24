import React, { createContext, useContext, useReducer, Dispatch, useCallback } from "react";
import { Types } from 'mongoose';

import { globalReducer } from "./globalReducer";

import { IGlobalContext, IGlobalState, ILoginUser, ROLES, GlobalActionTypes, IAuthUser } from './types'
import axios, { AxiosError } from "axios";
import { IUser } from "../users/types";

export const initialAuthUser: IAuthUser = {
  userId: new Types.ObjectId(),
  color: 'blue',
  userName: '',
  password: '',
  role: ROLES.VIEWER
}

const initialState: IGlobalState = {
  isAuthenticated: false,
  authUser: initialAuthUser,
  canEdit: false,
  isDarkMode: true,
  variant: 'dark',
  bg: 'dark',
  loading: false
}

const GlobalContext = createContext<IGlobalContext>({
  globalState: { ...initialState },
  loadStateFromLocalStorage: () => { },
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

  const loadStateFromLocalStorage = useCallback(() => {
    dispatch({ type: GlobalActionTypes.SET_LOADING, payload: {} }) // TODO treba li ovo 
    try {
      let globalState: IGlobalState | undefined;
      if ('localStorage' in window) {
        const s = localStorage.getItem('GLOBAL_STATE');
        if (s !== null) {
          const parsed = JSON.parse(s);
          console.log('parsed', parsed)
          globalState = parsed;
          //global = parseFromLocalStorage(parsed);
        }
      }
      if (globalState) {
        const { authUser } = globalState;
        dispatch({
          type: GlobalActionTypes.SET_STATE, payload: {
            globalState: {
              ...globalState,
              isAuthenticated: false
            }
          }
        });
        const loginUser: ILoginUser = {
          userName: authUser.userName,
          password: authUser.password
        }
        signInUser(loginUser);
      }
    }
    catch (err) {
      console.error(err);
    }
  }, [dispatch, signInUser]);

  return (
    <GlobalContext.Provider value={{ globalState, loadStateFromLocalStorage, registerUser, signInUser }}>
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





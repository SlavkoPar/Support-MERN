import { createContext, useContext, useState, useReducer, useEffect, useCallback, Dispatch } from 'react';
import { Types } from 'mongoose';

import { ActionTypes, FORM_MODES, IUser, IUsersState, IUsersContext } from './types';
import { usersReducer } from './usersReducer';
import axios, { AxiosError } from "axios";

const initialState: IUsersState = {
  mode: FORM_MODES.NULL,
  // user: null,
  loading: false,
  users: []
}

const UsersContext = createContext<IUsersContext>({
  store: { ...initialState },
  getUsers: ({ parentUser, level }: { parentUser: Types.ObjectId | null, level: number }) => { },
  editUser: (_id: Types.ObjectId) => { },
  updateUser: (user: IUser) => { },
  deleteUser: (_id: Types.ObjectId) => { }
});

const UserDispatchContext = createContext<Dispatch<any>>(() => null);

const configHost: string | undefined = process.env.REACT_APP_HOST;
const configPort: string | undefined = process.env.REACT_APP_PORT;
export const hostPort = `${configHost!}:${configPort!}`
console.log({ hostPort })

type Props = {
  children: React.ReactNode
}
export const UsersProvider: React.FC<Props> = ({ children }) => {
  const [store, dispatch] = useReducer(usersReducer, initialState);

  const getUsers = useCallback(({ parentUser, level }: { parentUser: Types.ObjectId | null, level: number }) => {
    const urlUsers = `${hostPort}/users/${parentUser}`
    console.log('FETCHING --->>> getUsers', level, parentUser)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    axios
      .get(urlUsers)
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: ActionTypes.SET_USERS, payload: { users: data } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  
  const editUser = useCallback((_id: Types.ObjectId) => {
    const url = `${hostPort}/users/get-user/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    axios
      .get(url)
      .then(({ data: user }) => {
        console.log(user)
        dispatch({ type: ActionTypes.EDIT, payload: { user } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);


  const updateUser = useCallback((user: IUser) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    const url = `${hostPort}/users/update-user/${user._id}`
    console.log(`UPDATING --->>> ${url}`)
    axios
      .put(url, user)
      .then(({ status, data: user }) => {
        if (status === 200) {
          console.log("User successfully updated");
          dispatch({ type: ActionTypes.REFRESH_UPDATED_USER, payload: { user } });
          dispatch({ type: ActionTypes.CLOSE_EDITING_FORM, payload: {} })
        }
        else {
          console.log('Status is not 200', status)
          dispatch({
            type: ActionTypes.SET_ERROR,
            payload: { error: new AxiosError('Status is not 200 status: ' + status) }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const deleteUser = (_id: Types.ObjectId) => {
    // dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .delete(`${hostPort}/users/delete-user/${_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log("User successfully deleted");
          dispatch({ type: ActionTypes.DELETE, payload: { _id } });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  };

  /*
  const refreshAddedUser = useCallback(_id => {
    const url = `${hostPort}/users/get-user/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING })
    axios
      .get(url)
      .then(({ data }) => {
        console.log(data)
        dispatch({ type: ActionTypes.REFRESH_ADDED_USER, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);
  */

  return (
    <UsersContext.Provider value={{ store, getUsers, editUser, updateUser, deleteUser }}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UsersContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UsersContext);
}

export const useUserDispatch = () => {
  return useContext(UserDispatchContext)
};


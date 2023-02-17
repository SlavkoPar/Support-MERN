
import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { Types } from 'mongoose';

import { globalReducer, GlobalActions } from "./globalReducer";

import { IGlobalState, ROLES } from './globalTypes'

const initialState: IGlobalState = {
  isAuthenticated: true,
  authUser: {
    userId: new Types.ObjectId('63ef5e1813d8ce86929c61be'), 
    color: 'blue',
    userName: 'Slavko',
    role: ROLES.OWNER,
    canEdit: true,
    darkMode: true
  },
}

const GlobalStoreContext = createContext<IGlobalState>(initialState);
const GlobalStoreDispatchContext = createContext<Dispatch<any>>(() => null);

interface Props {
  children: React.ReactNode
}

export const GlobalStoreProvider: React.FC<Props> = ({ children }) => {
  const [globalStore, dispatch] = useReducer(globalReducer, initialState);
  return (
    <GlobalStoreContext.Provider value={globalStore}>
      <GlobalStoreDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalStoreDispatchContext.Provider>
    </GlobalStoreContext.Provider>
  );
}

export function useGlobalStore() {
  return useContext(GlobalStoreContext);
}

export const useGlobalStoreDispatch = () => {
  return useContext(GlobalStoreDispatchContext)
};


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




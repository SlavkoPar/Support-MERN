
import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { globalReducer, GlobalActions } from "./globalReducer";

import { IGlobalState, ROLES } from './globalTypes'

const initialState: IGlobalState = {
  isAuthenticated: false,
  user: {
    userId: '63e0c6f6ad5c8d505b8d8399', // fiktivni _id
    color: 'blue',
    userName: undefined,
    role: ROLES.FIRST_REGISTERED_USER_IS_OWNER,
    canEdit: false,
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




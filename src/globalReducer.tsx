import { IGlobalState } from "./globalTypes";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};

export enum ActionTypes {
    Authenticate = "AUTHENTICATE",
    Delete = "DELETE_CATEGORY",
    Add = "ADD_CATEGORY"
}

type GlobalPayload = {
    [ActionTypes.Authenticate]: {
        id: number;
        name: string;
        price: number;
    };
    [ActionTypes.Delete]: {
        id: number;
    };
};

export type GlobalActions = ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

export const globalReducer = (state: IGlobalState, action: GlobalActions) => {
    switch (action.type) {
          case ActionTypes.Authenticate:
            return {
              ...state,
              isAuthenticated: true
            };
        //   case Types.Delete:
        //     return [...state.filter(product => product.id !== action.payload.id)];
        default:
            return state;
    }
};


import { FORM_MODES, ActionTypes, IUsersState, IUser, IParentInfo } from "./types";
import { Types } from 'mongoose';
import { AxiosError } from "axios";
import { ROLES } from "../global/types";

export const initialUser: IUser = {
  // temp _id for inAdding, to server as list key
  // it will be removed on submitForm
  // real _id will be given by the MongoDB 
  _id: new Types.ObjectId('000000000000000000000000'),
  userName: '',
  parentUser: null,
  level: 0,
  role: ROLES.VIEWER,
}

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

type UsersPayload = {
  [ActionTypes.SET_USERS]: {
    users: IUser[];
  };

  [ActionTypes.SET_LOADING]: {
  };

  [ActionTypes.CANCEL_ADDING_FORM]: {
  };

  [ActionTypes.CANCEL_EDITING_FORM]: {
  };

  [ActionTypes.CLOSE_EDITING_FORM]: {
  };

  [ActionTypes.ADD]: IParentInfo;

  [ActionTypes.EDIT]: {
    user: IUser;
  };

  [ActionTypes.REFRESH_UPDATED_USER]: {
    user: IUser;
  };

  [ActionTypes.DELETE]: {
    _id: Types.ObjectId;
  };

  [ActionTypes.CLEAN_SUB_TREE]: {
    user: IUser;
  };
  
  [ActionTypes.CLOSE_EDITING_FORM]: {
  };

  [ActionTypes.CLOSE_ADDING_FORM]: {
  };

  [ActionTypes.REFRESH_ADDED_USER]: {
    user: IUser;
  };

  [ActionTypes.REFRESH_UPDATED_USER]: {
    user: IUser;
  };

  [ActionTypes.SET_ERROR]: {
    error: AxiosError;
  };
};

export type UsersActions = ActionMap<UsersPayload>[keyof ActionMap<UsersPayload>];

export const reducer = (state: IUsersState, action: UsersActions) => {
  switch (action.type) {

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.SET_USERS: {
      return {
        ...state,
        users: state.users.concat(action.payload.users),
        loading: false
      };
    }

    case ActionTypes.CLEAN_SUB_TREE: {
      const { _id } = action.payload.user;
      const arr = markForClean(state.users, _id!)
      console.log('clean:', arr)
      const _ids = arr.map(c => c._id)
      return {
        ...state,
        users: state.users.filter(c => !_ids.includes(c._id))
      }
    }

    case ActionTypes.SET_ERROR: {
      const {error} = action.payload;
      return { ...state, error, loading: false };
    }

    case ActionTypes.ADD: {
      const { parentUser, level } = action.payload;
      const users: IUser[] = [
        {
          ...initialUser,
          userName: '',
          level: level + 1,
          parentUser,
          inAdding: true
        },
        ...state.users
      ]
      console.log('ADD', users)
      return {
        ...state,
        mode: FORM_MODES.ADD,
        users
      };
    }

    case ActionTypes.REFRESH_ADDED_USER: {
      console.log('REFRESH_ADDED_USER', state.users)
      const { user } = action.payload;
      return {
        ...state,
        users: state.users.map(c => c.inAdding ? user : c),
        loading: false
      }
    }

    case ActionTypes.REFRESH_UPDATED_USER: {
      const { user } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.NULL,
        user: null,
        users: state.users.map(c => c.inEditing ? user : c), // doesn't contain isEditing 
        loading: false
      }
    }

    case ActionTypes.EDIT: {
      const { user } = action.payload;
      return {
        ...state,
        mode: FORM_MODES.EDIT,
        user,
        users: state.users.map(c => c._id === user._id
          ? { ...user, inEditing: true }
          : c
        ),
        loading: false
      };
    }

    case ActionTypes.DELETE: {
      const {_id} = action.payload;
      return {
        ...state,
        mode: FORM_MODES.NULL,
        user: null,
        users: state.users.filter(c => c._id !== _id)
      };
    }

    case ActionTypes.CLOSE_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        user: null
      };
    }

    case ActionTypes.CANCEL_ADDING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        user: null,
        users: state.users.filter(c => !c.inAdding)
      };
    }

    case ActionTypes.CANCEL_EDITING_FORM:
    case ActionTypes.CLOSE_EDITING_FORM: {
      return {
        ...state,
        mode: FORM_MODES.NULL,
        user: null,
        users: state.users.map(c => c.inEditing ? ({ ...c, inEditing: false }) : c)
      };
    }
    
    default:
      return state;
  }
};

function markForClean(users: IUser[], parent_id: Types.ObjectId) {
  let arr = users
    .filter(user => user.parentUser === parent_id)

  arr.forEach(user => {
    arr = arr.concat(markForClean(users, user._id!))
  })
  return arr
}

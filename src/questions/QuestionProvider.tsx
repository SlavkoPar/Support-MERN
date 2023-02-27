import { createContext, useContext, useState, useReducer, useEffect, useCallback, Dispatch } from 'react';
import { Types } from 'mongoose';
import { hostPort } from '../global/GlobalProvider'
import { ActionTypes, FORM_MODES, IQuestion, IQuestionsState, IQuestionsContext, IParentInfo } from './types';
import { reducer } from './reducer';
import axios, { AxiosError } from "axios";

const initialState: IQuestionsState = {
  mode: FORM_MODES.NULL, // TODO provjeri ove MODESSSSSSSSSSSSSSSSSSSSS 
  loading: false,
  questions: []
}

const QuestionsContext = createContext<IQuestionsContext>({} as any);
const QuestionDispatchContext = createContext<Dispatch<any>>(() => null);

type Props = {
  children: React.ReactNode
}

export const QuestionProvider: React.FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const getQuestions = useCallback(({ parentCategory, level }: IParentInfo) => {
    const urlQuestions = `${hostPort}/questions/${parentCategory}`
    console.log('FETCHING --->>> getQuestions', level, parentCategory)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    axios
      .get(urlQuestions)
      .then(({ data }) => {
        dispatch({ type: ActionTypes.SET_QUESTIONS, payload: { questions: data } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);

  const createQuestion = useCallback((question: IQuestion) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} }) // TODO treba li ovo 
    axios
      .post(`${hostPort}/questions/create-question`, question)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log('Question successfully created')
          dispatch({ type: ActionTypes.REFRESH_ADDED_QUESTION, payload: { question: data } });
          dispatch({ type: ActionTypes.CLOSE_ADDING_FORM, payload: {} })
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

  const editQuestion = useCallback((_id: Types.ObjectId) => {
    const url = `${hostPort}/questions/get-question/${_id}`
    console.log(`FETCHING --->>> ${url}`)
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    axios
      .get(url)
      .then(({ data: question }) => {
        console.log(question)
        dispatch({ type: ActionTypes.EDIT, payload: { question } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: error });
      });
  }, []);


  const updateQuestion = useCallback((question: IQuestion) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: {} })
    const url = `${hostPort}/questions/update-question/${question._id}`
    console.log(`UPDATING --->>> ${url}`)
    axios
      .put(url, question)
      .then(({ status, data: question }) => {
        if (status === 200) {
          console.log("Question successfully updated");
          dispatch({ type: ActionTypes.REFRESH_UPDATED_QUESTION, payload: { question } });
          dispatch({ type: ActionTypes.CLOSE_EDITING_FORM, payload: {} })
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

  const contextValue = { state: state, getQuestions, createQuestion, editQuestion, updateQuestion, deleteQuestion }
  return (
    <QuestionsContext.Provider value={contextValue}>
      <QuestionDispatchContext.Provider value={dispatch}>
        {children}
      </QuestionDispatchContext.Provider>
    </QuestionsContext.Provider>
  );
}

export function useQuestionContext() {
  return useContext(QuestionsContext);
}

export const useQuestionDispatch = () => {
  return useContext(QuestionDispatchContext)
};


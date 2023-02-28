import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../../categories/Provider'
import { useGlobalContext, useGlobalState } from '../../global/GlobalProvider'

import QuestionForm from "./QuestionForm";
import InLineQuestionForm from "./InLineQuestionForm";
import { IQuestion } from "../types";
import { initialQuestion } from "../reducer";
import { ICategory } from "../../categories/types";

// const Add = ({ category, question, inLine } : { category: ICategory, question: IQuestion, inLine: boolean}) => {
const Add = ({ category, inLine }: { category: ICategory, inLine: boolean }) => {
    const globalState = useGlobalState();

    const question: IQuestion = {
        ...initialQuestion,
        parentCategory: category._id!


    }
    const [formValues] = useState(question)

    const { state, createQuestion } = useCategoryContext();

    const submitForm = (questionObject: IQuestion) => {
        delete questionObject.inAdding;
        delete questionObject._id;
        const object: IQuestion = {
            ...questionObject,
            //_id: undefined,
            created: {
                date: new Date(),
                by: {
                    userId: globalState.authUser.userId
                }
            }
        }
        createQuestion(object);
    }

    return (
        <>
            {inLine ?
                <InLineQuestionForm
                    initialValues={formValues}
                    isEdit={false}
                    submitForm={submitForm}
                >
                    Create
                </InLineQuestionForm>
                :
                <QuestionForm
                    initialValues={formValues}
                    isEdit={false}
                    submitForm={submitForm}
                >
                    Create Question
                </QuestionForm >
            }
        </>
    )
}

export default Add

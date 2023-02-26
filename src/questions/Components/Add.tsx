import React, { useState, useEffect } from "react";
import { useQuestionContext } from '../Provider'
import { useGlobalContext, useGlobalState } from '../../global/GlobalProvider'

import QuestionForm from "./QuestionForm";
import InLineQuestionForm from "./InLineQuestionForm";
import { IQuestion } from "../types";

const Add = ({ question, inLine } : { question: IQuestion, inLine: boolean}) => {
    const globalState = useGlobalState();

    const [formValues] = useState(question)

    const { state, createQuestion } = useQuestionContext();

    const submitForm = (questionObject: IQuestion) => {
        delete questionObject.inAdding;
        const object: IQuestion = {
            ...questionObject,
            _id: undefined,
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

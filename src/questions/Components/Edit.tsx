//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useQuestionContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import QuestionForm from "./QuestionForm";
import { IQuestion } from "../types";

const Edit = () => {
    const globalState = useGlobalState();
    const { state, updateQuestion } = useQuestionContext();
    const question = state.questions.find(c=>c.inEditing);

    const [formValues, setFormValues] = useState<IQuestion>(question!);

    const submitForm = (questionObject: IQuestion) => {
        const object: IQuestion = {
            ...questionObject,
            modified: {
                date: new Date(),
                by: {
                    userId: globalState.authUser.userId
                }
            }
        }
        updateQuestion(object)
    };

    useEffect(() => {
        //question.modifiedBy_userName = question.modifiedBy_user.userName;
        setFormValues(question!);
    }, [question]);

    return (
        <QuestionForm
            initialValues={formValues}
            isEdit={true}
            submitForm={submitForm}
        >
            Update Question
        </QuestionForm>
    );
};

export default Edit;

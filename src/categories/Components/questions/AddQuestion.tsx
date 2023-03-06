import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../../Provider'
import { useGlobalContext, useGlobalState } from '../../../global/GlobalProvider'

import QuestionForm from "./QuestionForm";
//import InLineQuestionForm from "./InLineQuestionForm";
import { FormMode, IQuestion } from "../../types";
import { initialQuestion } from "../../reducer";
import { ICategory } from "../../types";

// const Add = ({ category, question, inLine } : { category: ICategory, question: IQuestion, inLine: boolean}) => {
const AddQuestion = ({ question, inLine } : { question: IQuestion, inLine: boolean }) => { //{ category }: { category: ICategory }) => {
    const globalState = useGlobalState();

    const { state, createQuestion } = useCategoryContext();
    //const category = state.categories.find(c=>c.inAdding);

    // const question: IQuestion = {
    //     ...initialQuestion,
    //     parentCategory: category!._id!
    // }
    const [formValues] = useState(question)

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
            <QuestionForm
                initialValues={formValues}
                mode={FormMode.adding}
                submitForm={submitForm}
            >
                Create Question
            </QuestionForm >
        </>
    )
}

export default AddQuestion

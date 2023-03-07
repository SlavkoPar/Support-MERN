//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../../Provider'
import { useGlobalState } from '../../../global/GlobalProvider'

import { FormMode,IQuestion } from "../../types";
//import ProductForm from "../../questions/Components/ProductForm";
import QuestionForm from "./QuestionForm";

const ViewQuestion = ({ inLine }: {inLine: boolean}) => {
    const { state } = useCategoryContext();
    const category = state.categories.find(c=>c.inViewing);
    const question = category!.questions.find(q => q.inViewing)

    const [formValues, setFormValues] = useState<IQuestion>(question!);

    useEffect(() => {
        setFormValues(question!);
    }, [question]);

    return (
        <QuestionForm
            initialValues={formValues}
            mode={FormMode.viewing}
            submitForm={() => {}}
        >
            Update Question
        </QuestionForm>
    );
}

export default ViewQuestion;

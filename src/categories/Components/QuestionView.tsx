//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { FormMode, ICategory } from "../types";
import { IQuestion } from "../types";
//import ProductForm from "../../questions/Components/ProductForm";
import CategoryForm from "./CategoryForm";
import { initialQuestion } from "../reducer";
import QuestionForm from "./QuestionForm";

const QuestionView = () => {
    const globalState = useGlobalState();
    const { state, updateCategory } = useCategoryContext();
    const category = state.categories.find(c=>c.inViewing);
    const question = category!.questions.find(q => q.inViewing )

    const [formValues, setFormValues] = useState<IQuestion>(question??initialQuestion);

    useEffect(() => {
        //category.modifiedBy_userName = category.modifiedBy_user.userName;
        setFormValues(question!);
    }, [question]);

    return (
        <QuestionForm
            initialValues={formValues}
            mode={FormMode.viewing}
            submitForm={() => {}}
        >
            Update Category
        </QuestionForm>
    );
}

export default QuestionView;

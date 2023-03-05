//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { FormMode, ICategory } from "../types";
import { IQuestion } from "../types";
//import ProductForm from "../../questions/Components/ProductForm";
import CategoryForm from "./CategoryForm";

const ViewCategory = ({ inLine }: {inLine: boolean}) => {
    const globalState = useGlobalState();
    const { state, updateCategory } = useCategoryContext();
    const category = state.categories.find(c=>c.inViewing);

    const [formValues, setFormValues] = useState<ICategory>(category!);

    useEffect(() => {
        //category.modifiedBy_userName = category.modifiedBy_user.userName;
        setFormValues(category!);
    }, [category]);

    return (
        <CategoryForm
            inLine={inLine}
            initialValues={formValues}
            mode={FormMode.viewing}
            submitForm={() => {}}
        >
            Update Category
        </CategoryForm>
    );
}

export default ViewCategory;

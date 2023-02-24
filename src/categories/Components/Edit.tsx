//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import CategoryForm from "./CategoryForm";
import { ICategory } from "../types";

const Edit = () => {
    const globalState = useGlobalState();
    const { state, updateCategory } = useCategoryContext();
    const category = state.categories.find(c=>c.inEditing);

    const [formValues, setFormValues] = useState<ICategory>(category!);

    const submitForm = (categoryObject: ICategory) => {
        const object: ICategory = {
            ...categoryObject,
            modified: {
                date: new Date(),
                by: {
                    userId: globalState.authUser.userId
                }
            }
        }
        updateCategory(object)
    };

    useEffect(() => {
        //category.modifiedBy_userName = category.modifiedBy_user.userName;
        setFormValues(category!);
    }, [category]);

    return (
        <CategoryForm
            initialValues={formValues}
            isEdit={true}
            submitForm={submitForm}
        >
            Update Category
        </CategoryForm>
    );
};

export default Edit;

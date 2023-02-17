//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalStore } from '../../GlobalStoreProvider'

import CategoryForm from "./CategoryForm";
import { ICategory } from "../types";

const Edit = () => {
    const globalStore = useGlobalStore();
    const { store, updateCategory } = useCategoryContext();
    const { category } = store;

    const [formValues, setFormValues] = useState<ICategory>(category!);

    const submitForm = (categoryObject: ICategory) => {
        const object: ICategory = {
            ...categoryObject
            //modified: new Date(),
            //modifiedBy: globalStore.user.userId
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

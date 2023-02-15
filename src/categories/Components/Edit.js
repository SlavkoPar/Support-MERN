//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalStore } from '../../GlobalStoreProvider'

import CategoryForm from "./CategoryForm";

const Edit = () => {
    const globalStore = useGlobalStore();
    const { store, updateCategory } = useCategoryContext();

    const [formValues, setFormValues] = useState({
        name: "",
        created: "",
        modified: "",
        createdBy_userName: "",
        modifiedBy_userName: ""
    });

    const onSubmit = (categoryObject) => {
        const object = {
            ...categoryObject,
            modified: new Date(),
            modifiedBy: globalStore.user.userId
        }
        updateCategory(object)
    };

    const formatDate = (date) => date
        ? new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString()
        : "";

    useEffect(() => {
        const { category } = store;
        category.created = formatDate(category.created);
        category.modified = formatDate(category.modified);
        category.modifiedBy_userName = category.modifiedBy_user.userName;
        setFormValues(category);
    }, [store]);

    return (
        <CategoryForm
            initialValues={formValues}
            isEdit={true}
            onSubmit={onSubmit}
            enableReinitialize
        >
            Update Category
        </CategoryForm>
    );
};

export default Edit;

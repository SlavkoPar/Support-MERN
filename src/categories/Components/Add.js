import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalStore } from '../../GlobalStoreProvider'

import CategoryForm from "./CategoryForm";
import InLineCategoryForm from "./InLineCategoryForm";

const Add = ({ category, inLine }) => {
    const globalStore = useGlobalStore();

    const [formValues, setFormValues] = useState(category)

    const { store, createCategory } = useCategoryContext();

    const onSubmit = categoryObject => {
        delete categoryObject._id;
        const object = {
            ...categoryObject,
            created: new Date(),
            createdBy: globalStore.user.userId
        }
        createCategory(object);
    }

    return (
        <>
            {inLine ?
                <InLineCategoryForm
                    initialValues={formValues}
                    isEdit={false}
                    onSubmit={onSubmit}
                >
                    Create
                </InLineCategoryForm>
                :
                <CategoryForm
                    initialValues={formValues}
                    isEdit={false}
                    onSubmit={onSubmit}
                >
                    Create Category
                </CategoryForm >
            }
        </>
    )
}

export default Add

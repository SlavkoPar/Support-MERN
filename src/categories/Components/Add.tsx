import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalStore } from '../../GlobalStoreProvider'

import CategoryForm from "./CategoryForm";
import InLineCategoryForm from "./InLineCategoryForm";
import { ICategory } from "../types";

const Add = ({ category, inLine } : { category: ICategory, inLine: boolean}) => {
    const globalStore = useGlobalStore();

    const [formValues, setFormValues] = useState(category)

    const { store, createCategory } = useCategoryContext();

    const submitForm = (categoryObject: ICategory) => {
        delete categoryObject._id;
        delete categoryObject.inAdding;
        const object = {
            ...categoryObject,
            created: {
                date: new Date(),
                by: {
                    userId: globalStore.authUser.userId
                }
            }
        }
        createCategory(object);
    }

    return (
        <>
            {inLine ?
                <InLineCategoryForm
                    initialValues={formValues}
                    isEdit={false}
                    submitForm={submitForm}
                >
                    Create
                </InLineCategoryForm>
                :
                <CategoryForm
                    initialValues={formValues}
                    isEdit={false}
                    submitForm={submitForm}
                >
                    Create Category
                </CategoryForm >
            }
        </>
    )
}

export default Add

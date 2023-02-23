import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalContext, useGlobalState } from '../../global/GlobalProvider'

import CategoryForm from "./CategoryForm";
import InLineCategoryForm from "./InLineCategoryForm";
import { ICategory } from "../types";
import { initialCategory } from "../categoriesReducer";

const Add = ({ category, inLine } : { category: ICategory, inLine: boolean}) => {
    const globalState = useGlobalState();

    const [formValues] = useState(category)

    const { store, createCategory } = useCategoryContext();

    const submitForm = (categoryObject: ICategory) => {
        delete categoryObject.inAdding;
        const object: ICategory = {
            ...categoryObject,
            _id: undefined,
            created: {
                date: new Date(),
                by: {
                    userId: globalState.authUser.userId
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

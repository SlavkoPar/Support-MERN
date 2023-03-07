import { useState } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import CategoryForm from "./CategoryForm";
import InLineCategoryForm from "./InLineCategoryForm";
import { FormMode, ICategory } from "../types";

const AddCategory = ({ category, inLine } : { category: ICategory, inLine: boolean}) => {
    const globalState = useGlobalState();
    const { createCategory } = useCategoryContext();
    const [formValues] = useState(category)

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
                    inLine={true}
                    initialValues={formValues}
                    mode={FormMode.adding}
                    submitForm={submitForm}
                >
                    Create
                </InLineCategoryForm>
                :
                <CategoryForm
                    inLine={false}
                    initialValues={formValues}
                    mode={FormMode.adding}
                    submitForm={submitForm}
                >
                    Create Category
                </CategoryForm >
            }
        </>
    )
}

export default AddCategory

//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import { ICategory } from "../types";
import { IQuestion } from "../../questions/types";
import QuestionForm from "../../questions/Components/QuestionForm";

const CategoryView = () => {
    const globalState = useGlobalState();
    const { state, updateCategory } = useCategoryContext();
    const category = state.categories.find(c=>c.inEditing);
    const questions: IQuestion[] = category!.questions??[];

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
        <ul>{
            questions.map((q: IQuestion) => 
                <li>
                    <QuestionForm initialValues={q} isEdit={true} submitForm={() => {}}>
                        Add to cart
                    </QuestionForm>
                </li>
            )
        }
        </ul>
    );
};

export default CategoryView;

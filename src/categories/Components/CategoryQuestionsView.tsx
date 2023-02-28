//import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useCategoryContext } from '../Provider'
import { useGlobalState } from '../../global/GlobalProvider'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { ICategory } from "../types";
import { IQuestion } from "../../questions/types";
import ProductForm from "../../questions/Components/ProductForm";

const CategoryQuestionsView = () => {
    const globalState = useGlobalState();
    const { state, updateCategory } = useCategoryContext();
    const category = state.categories.find(c => c.inEditing);
    const questions: IQuestion[] = category!.questions ?? [];

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
        // <ul className="d-flex justify-content-start align-items-center flex-row flex-wrap">
        <ListGroup
            as="ul"
            variant='dark'
            className="mb-0 d-flex justify-content-start align-items-center flex-row flex-wrap"
            style={{backgroundColor: '#cdbcf2'}}
        >
            {
                questions.map((q: IQuestion) =>
                    <ListGroup.Item
                        variant={'dark'}
                        className="py-1 px-1 mb-1 ms-2 my-2"
                        as="li"
                        key={q._id!.toString()}
                    >
                        <ProductForm initialValues={q} isEdit={true} submitForm={() => { }}>
                            Add to cart
                        </ProductForm>
                    </ListGroup.Item>
                )
            }
        </ListGroup>
    );
}

export default CategoryQuestionsView;

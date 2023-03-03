import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import QuestionRow from "./QuestionRow";
import { ICategory, IQuestion, IParentInfo } from "../../types";
import { useCategoryContext } from "../../Provider";
import {  } from "../../types";

const QuestionList = ({ parentCategory, level }: IParentInfo) => {
    const { state, getCategoryQuestions } = useCategoryContext();
    useEffect(() => {
        console.log('Zovem getQuestions', level, parentCategory)
        getCategoryQuestions({ parentCategory, level });
    }, [level, getCategoryQuestions, parentCategory]);

    // console.log('level, parentCategory:', level, parentCategory)
    const category = state.categories.find(c => c._id === parentCategory);
    const questions  = category!.questions??[]; 
    // console.log('length:', cats.length)
    // cats.forEach(c => console.log(c.parentCategory, c.title));
    const cat: ICategory = {  // TODO uvedi ICategoryParams
        _id: parentCategory??undefined,
        level: 12345,
        title: '',
        parentCategory: null,
        questions: []
    }
    return (
        <div className={`ms-0`}>
            <>
                <ListGroup as="ul" variant='light' className={level>1?'mb-0 ms-4':'mb-0'}>
                    {questions.map((question: IQuestion) => 
                        <QuestionRow category={cat} question={question} key={question._id!.toString()} />)
                    }
                </ListGroup>

                {state.error && state.error}
                {/* {state.loading && <div>...loading</div>} */}
            </>
        </div>
    );
};

export default QuestionList;

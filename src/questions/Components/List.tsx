import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import QuestionRow from "./QuestionRow";
import { IParentInfo } from "../types";
import { useQuestionContext } from "../QuestionProvider";

const List = ({ parentCategory, level }: IParentInfo) => {
    const { state, getQuestions } = useQuestionContext();
    useEffect(() => {
        console.log('Zovem getQuestions', level, parentCategory)
        getQuestions({ parentCategory: parentCategory, level });
    }, [level, getQuestions, parentCategory]);

    // console.log('level, parentCategory:', level, parentCategory)
    const cats = state.questions.filter(c => c.parentCategory === parentCategory);
    // console.log('length:', cats.length)
    // cats.forEach(c => console.log(c.parentCategory, c.title));

    return (
        <div className={`ms-2`}>
            <>
                <ListGroup as="ul" variant='dark' className="mb-0">
                    {cats.map(question => 
                        <QuestionRow question={question} key={question._id!.toString()} />)
                    }
                </ListGroup>

                {state.error && state.error}
                {/* {state.loading && <div>...loading</div>} */}
            </>
        </div>
    );
};

export default List;

import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import QuestionRow from "./QuestionRow";
import { IParentInfo } from "../types";
import { useQuestionContext } from "../Provider";

const List = ({ parentQuestion, level }: IParentInfo) => {
    const { state, getQuestions } = useQuestionContext();
    useEffect(() => {
        console.log('Zovem getQuestions', level, parentQuestion)
        getQuestions({ parentQuestion, level });
    }, [level, getQuestions, parentQuestion]);

    // console.log('level, parentQuestion:', level, parentQuestion)
    const cats = state.questions.filter(c => c.parentQuestion === parentQuestion);
    // console.log('length:', cats.length)
    // cats.forEach(c => console.log(c.parentQuestion, c.title));

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

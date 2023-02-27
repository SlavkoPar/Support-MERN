import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { useGlobalState } from '../global/GlobalProvider'
import { FORM_MODES, ActionTypes } from "./types";
import { QuestionProvider, useQuestionContext, useQuestionDispatch } from "./QuestionProvider";

import List from "./Components/List";
// import Add from "./Components/Add";
import Edit from "./Components/Edit";
import { initialQuestion } from "./reducer";

const Providered = () => {

    const globalState = useGlobalState();
    const { state } = useQuestionContext();
    const dispatch = useQuestionDispatch();

    return (
        <>
            <Button variant="secondary" size="sm" type="button"
                onClick={() => dispatch({ 
                        type: ActionTypes.ADD,
                        payload: {
                             parentCategory: null,
                             level: 0 
                        }
                    })
                }
            >
                Add Question
            </Button>
            <Container>
                <Row>
                    <Col xs={12} md={7}>
                        <div>
                            <List parentCategory={null} level={1} />
                        </div>
                    </Col>
                    <Col xs={0} md={5}>
                        {/* {store.mode === FORM_MODES.ADD && <Add question={question??initialQuestion} />} */}
                        {/* <div class="d-none d-lg-block">hide on screens smaller than lg</div> */}
                        <div className="d-none d-md-block">
                            {state.mode === FORM_MODES.EDIT && <Edit />}
                        </div>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

const Questions = () => {
    return (
        <QuestionProvider>
            <Providered />
        </QuestionProvider>
    )
}

export default Questions;
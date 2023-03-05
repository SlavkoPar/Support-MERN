import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { useGlobalState } from '../global/GlobalProvider'
import { FormModes, ActionTypes } from "./types";
import { Provider, useCategoryContext, useCategoryDispatch } from "./Provider";

import List from "./Components/CategoryList";
// import Add from "./Components/Add";
import CategoryView from "./Components/CategoryView";
import EditCategory from "./Components/EditCategory";
import { initialCategory } from "./reducer";
import ViewQuestion from "./Components/questions/ViewQuestion";
import EditQuestion from "./Components/questions/EditQuestion";
import AddQuestion from "./Components/questions/AddQuestion";

const Providered = () => {

    const globalState = useGlobalState();
    const { state } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    return (
        <Container>
            <Button variant="secondary" size="sm" type="button"
                onClick={() => dispatch({
                    type: ActionTypes.ADD_CATEGORY,
                    payload: {
                        parentCategory: null,
                        level: 0
                    }
                })
                }
            >
                Add Category
            </Button>
            <Row>
                <Col xs={12} md={6}>
                    <div>
                        <List parentCategory={null} level={1} />
                    </div>
                </Col>
                <Col xs={0} md={6}>
                    {/* {store.mode === FORM_MODES.ADD && <Add category={category??initialCategory} />} */}
                    {/* <div class="d-none d-lg-block">hide on screens smaller than lg</div> */}
                    <div className="d-none d-md-block">
                        {state.mode === FormModes.ViewingCategory && <CategoryView />}
                        {state.mode === FormModes.EditingCategory && <EditCategory />}
                        {/* {state.mode === FORM_MODES.ADD_QUESTION && <AddQuestion category={null} />} */}
                        {state.mode === FormModes.ViewingQuestion && <ViewQuestion />}
                        {state.mode === FormModes.EditingQuestion && <EditQuestion />}
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

const Categories = () => {
    return (
        <Provider>
            <Providered />
        </Provider>
    )
}

export default Categories;
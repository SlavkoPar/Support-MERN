import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { useGlobalStore } from '../GlobalStoreProvider'
import { FORM_MODES, ActionTypes } from "./types";
import { Provider, useCategoryContext, useCategoryDispatch } from "./Provider";

import TreeView from "./Components/TreeView";
// import Add from "./Components/Add";
import Edit from "./Components/Edit";

const Providered = () => {

    const globalStore = useGlobalStore();
    const { store } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    return (
        <>
            <Button variant="secondary" size="sm" block="block" type="button"
                onClick={() => dispatch({ 
                        type: ActionTypes.ADD,
                        category: {
                            _id: null,
                            level: 0
                        }, 
                        createdBy: globalStore.user.userId 
                    })
                }
            >
                Add Category
            </Button>
            <Container>
                <Row>
                    <Col xs={12} md={7}>
                        <div>
                            <TreeView parentCategory={null} level={1} />
                        </div>
                    </Col>
                    <Col xs={0} md={5}>
                        {/* {store.mode === FORM_MODES.ADD && <Add category={category??initialCategory} />} */}
                        {/* <div class="d-none d-lg-block">hide on screens smaller than lg</div> */}
                        <div className="d-none d-md-block">
                            {store.mode === FORM_MODES.EDIT && <Edit />}
                        </div>

                    </Col>
                </Row>
            </Container>
        </>
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
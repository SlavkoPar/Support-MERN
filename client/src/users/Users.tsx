import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { ActionTypes } from "users/types";
import { Provider, useUserDispatch } from "users/Provider";


const Providered = () => {

    const dispatch = useUserDispatch();

    return (
        <>
            <Button variant="secondary" size="sm" type="button"
                onClick={() => dispatch({ 
                        type: ActionTypes.ADD,
                        payload: {
                             parentUser: null,
                             level: 0 
                        }
                    })
                }
            >
                Add User
            </Button>
            <Container>
                <Row>
                    <Col xs={12} md={7}>
                        <div>
                            {/* <TreeView parentUser={null} level={1} /> */}
                        </div>
                    </Col>
                    <Col xs={0} md={5}>
                        {/* {store.mode === FORM_MODES.ADD && <Add category={category??initialUser} />} */}
                        {/* <div class="d-none d-lg-block">hide on screens smaller than lg</div> */}
                        <div className="d-none d-md-block">
                            {/* {store.mode === FORM_MODES.EDIT && <Edit />} */}
                        </div>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

const Users = () => {
    return (
        <Provider>
            <Providered />
        </Provider>
    )
}

export default Users;
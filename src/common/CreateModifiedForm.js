import React from "react";
import { Field } from "formik";
import { FormGroup, Container, Row, Col } from "react-bootstrap";


export const CreatedModifiedForm = ({ modified }) => {
  return (
    <Container className="my-1">
      <Row>
        <Col className="px-0">
          {/* <legend style={{ margin: '0px' }}>Created</legend> */}

          <fieldset style={{ border: '1px solid silver', borderRadius: '5px', padding: '5px' }}>
            <FormGroup>
              <label htmlFor="createdBy_userName" className="form-label">Created By</label>
              <Field name="createdBy_userName" type="text" className="form-control form-control-sm" disabled />
            </FormGroup>

            <FormGroup>
              {/* <label htmlFor="created" className="form-label">Date</label> */}
              <Field name="created" type="text" className="form-control form-control-sm" disabled />
            </FormGroup>
          </fieldset>

          {modified &&
            <>
            {/* <legend style={{ margin: '0px' }}>Modified</legend> */ }
            < fieldset style={{ border: '1px solid silver', borderRadius: '5px', padding: '5px' }}>
          <FormGroup>
            <label htmlFor="modifiedBy_userName" className="form-label">Modified By</label>
            <Field name="modifiedBy_userName" type="text" className="form-control form-control-sm" disabled />
          </FormGroup>

          <FormGroup>
            {/* <label htmlFor="modified" className="form-label">Date</label> */}
            <Field name="modified" type="text" className="form-control form-control-sm" disabled />
          </FormGroup>
          </fieldset>
          </>
      }
    </Col>
      </Row >
    </Container >
  );
};

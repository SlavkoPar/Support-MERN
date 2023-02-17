import React from "react";
import { Form, FormGroup, Container, Row, Col } from "react-bootstrap";
import { formatDate } from './utilities'
import { IDateAndBy } from '../globalTypes'

export const CreatedModifiedForm = ({ created, modified }: { created?: IDateAndBy, modified?: IDateAndBy }) => {
  return (
    <Container className="my-1">
      <Row>
        <Col className="px-0">

          {created &&
            <>
              {/* <legend style={{ margin: '0px' }}>Created</legend> */}
              <fieldset style={{ border: '1px solid silver', borderRadius: '5px', padding: '5px' }}>
                <Form.Group controlId="created_By_userName">
                  <Form.Label className="id">Created By</Form.Label>
                  <input name="created_By_userName" type="text" defaultValue={created.by.userName} className="form-control form-control-sm" disabled />
                </Form.Group>

                <Form.Group controlId="created">
                  <Form.Label className="id">Created:</Form.Label>
                  <input type="text" defaultValue={formatDate(created.date)} className="form-control form-control-sm" disabled />
                </Form.Group>
              </fieldset>
            </>
          }

          {modified &&
            <>
              {/* <legend style={{ margin: '0px' }}>Modified</legend> */}
              < fieldset style={{ border: '1px solid silver', borderRadius: '5px', padding: '5px' }}>
                <FormGroup>
                  <label htmlFor="modified_By_userName" className="form-label">Modified By</label>
                  {/* <Field name="modifiedBy_userName" type="text" className="form-control form-control-sm" disabled /> */}
                  <input name="modified_By_userName" defaultValue={modified.by.userName} type="text" className="form-control form-control-sm" disabled />

                </FormGroup>

                <FormGroup>
                  {/* <label htmlFor="modified" className="form-label">Date</label> */}
                  {/* <Field name="modified" type="text" className="form-control form-control-sm" disabled /> */}
                </FormGroup>
              </fieldset>
            </>
          }
        </Col>
      </Row >
    </Container >
  );
};

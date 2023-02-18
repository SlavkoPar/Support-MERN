import React from "react";
import { Form, FormGroup, Container, Row, Col } from "react-bootstrap";
import { formatDate } from './utilities'
import { ICreatedModifiedProps } from './types'

export const CreatedModifiedForm = ({ created, createdBy, modified, modifiedBy }: ICreatedModifiedProps) => {
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
                  <input name="createdBy" type="text" defaultValue={createdBy} className="form-control form-control-sm" disabled />
                </Form.Group>

                <Form.Group controlId="created">
                  {/* <Form.Label className="id">Date:</Form.Label> */}
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
                  <label htmlFor="modifiedBy" className="form-label">Modified By</label>
                  {/* <Field name="modifiedBy_userName" type="text" className="form-control form-control-sm" disabled /> */}
                  <input name="modifiedBy" defaultValue={modifiedBy} type="text" className="form-control form-control-sm" disabled />
                </FormGroup>

                <Form.Group controlId="modified">
                  {/* <Form.Label className="id">Date:</Form.Label> */}
                  <input type="text" defaultValue={formatDate(modified.date)} className="form-control form-control-sm" disabled />
                </Form.Group>
              </fieldset>
            </>
          }
        </Col>
      </Row >
    </Container >
  );
};

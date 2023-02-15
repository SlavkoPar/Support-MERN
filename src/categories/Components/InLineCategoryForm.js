import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { FormButtons } from "../../common/FormButtons"

import { ActionTypes } from "../types";

import { useCategoryDispatch } from "../Provider";

const InLineCategoryForm = (props) => {
  const { _id, level } = props.initialValues;

  const dispatch = useCategoryDispatch();

  const cancelForm = () => {
    dispatch({ type: props.isEdit ? ActionTypes.CANCEL_EDITING_FORM : ActionTypes.CANCEL_ADDING_FORM })
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    // email: Yup.string()
    //   .email("You have enter an invalid email address")
    //   .required("Required"),
    // rollno: Yup.number()
    //   .positive("Invalid roll number")
    //   .integer("Invalid roll number")
    //   .required("Required"),
  });

  console.log(props);
  const formRef = useRef();
  const nameRef = useRef();

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  return (
    // <div className="form-wrapper">
    // <CloseButton onClick={closeForm} />

    <Formik {...props} validationSchema={validationSchema} innerRef={formRef}>
      <tr>
        <td>
          <FontAwesomeIcon color='orange' size='lg' icon={faCaretRight} />
        </td>
        <td title={_id}>
          <Form >
            <FormGroup>
              <Field name="name" type="text" className="form-control" innerRef={nameRef} />
              <ErrorMessage
                name="name"
                className="d-block invalid-feedback"
                component="span"
              />
            </FormGroup>
          </Form>
        </td>
        <td>
          <FormButtons
            title={props.children}
            inLine={true}
            cancelForm={cancelForm}
            handleSubmit={() => formRef.current.handleSubmit()}
          />
        </td>
      </tr >
    </Formik>

    // </div>



  );
};

export default InLineCategoryForm;
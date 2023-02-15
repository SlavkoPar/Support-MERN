import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, CloseButton } from "react-bootstrap";
import { CreatedModifiedForm } from "../../common/CreateModifiedForm"
import { FormButtons } from "../../common/FormButtons"
import { FORM_MODES, ActionTypes } from "../types";

import { useCategoryDispatch } from "../Provider";

const CategoryForm = (props) => {

  const dispatch = useCategoryDispatch();

  const closeForm = () => {
    dispatch({ type: props.isEdit ? ActionTypes.CLOSE_EDITING_FORM : ActionTypes.CLOSE_ADDING_FORM })
  }

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
  useEffect(()=> {
    nameRef.current.focus()
  }, [])

  return (
    <div className="form-wrapper">
      <CloseButton onClick={closeForm}  className="float-end" />
      <Formik {...props} validationSchema={validationSchema} innerRef={formRef}>
        <Form>
          <FormGroup>
            <label className="form-label" htmlFor="name">Name</label>
            <Field name="name" type="text" className="form-control" innerRef={nameRef} /> {/*form-control-sm*/}
            <ErrorMessage
              name="name"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>

          {props.isEdit && <CreatedModifiedForm modified={props.initialValues.modified} /> }
          <FormButtons 
            cancelForm={cancelForm}
            handleSubmit={() => formRef.current.handleSubmit()} title={props.children} />
        </Form>
      </Formik>
    </div>
  );
};

export default CategoryForm;
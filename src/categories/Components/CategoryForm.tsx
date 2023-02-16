import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Field, ErrorMessage, useFormik } from "formik";
import { FormGroup, CloseButton } from "react-bootstrap";
import { CreatedModifiedForm } from "../../common/CreateModifiedForm"
import { FormButtons } from "../../common/FormButtons"
import { ActionTypes, ICategoryFormProps } from "../types";

import { useCategoryDispatch } from "../Provider";

const CategoryForm = (props: ICategoryFormProps) => {

  const dispatch = useCategoryDispatch();

  const closeForm = () => {
    dispatch({ type: props.isEdit ? ActionTypes.CLOSE_EDITING_FORM : ActionTypes.CLOSE_ADDING_FORM })
  }

  const cancelForm = () => {
    dispatch({ type: props.isEdit ? ActionTypes.CANCEL_EDITING_FORM : ActionTypes.CANCEL_ADDING_FORM })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      // email: Yup.string()
      //   .email("You have enter an invalid email address")
      //   .required("Required"),
      // rollno: Yup.number()
      //   .positive("Invalid roll number")
      //   .integer("Invalid roll number")
      //   .required("Required"),
    }),
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      props.onSubmit(values)
      //props.handleClose(false);
    }
  });

  console.log(props);
  // eslint-disable-next-line no-self-compare
  const nameRef =  useRef<HTMLInputElement | null>(null);

  useEffect(()=> {
    nameRef.current!.focus()
  }, [nameRef])

  return (
    <div className="form-wrapper">
      <CloseButton onClick={closeForm}  className="float-end" />
      {/* <Formik {...props} validationSchema={validationSchema} innerRef={formRef}> */}
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

          {props.isEdit && <CreatedModifiedForm created={props.initialValues.created} modified={props.initialValues.modified} /> }
          <FormButtons 
            cancelForm={cancelForm}
            handleSubmit={() => formik.handleSubmit()} title={props.children} />
        </Form>
      {/* </Formik> */}
    </div>
  );
};

export default CategoryForm;
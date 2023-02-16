import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Form, Field, ErrorMessage, useFormik } from "formik";
import { FormGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { FormButtons } from "../../common/FormButtons"

import { ActionTypes, ICategory } from "../types";

import { useCategoryDispatch } from "../Provider";

const InLineCategoryForm = (props: any) => {
  const { _id, level } = props.initialValues;

  const dispatch = useCategoryDispatch();

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
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    nameRef.current!.focus()
  }, [])

  return (
    // <div className="form-wrapper">
    // <CloseButton onClick={closeForm} />

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
          cancelForm={cancelForm}
          handleSubmit={() => formik.handleSubmit()}
        />
      </td>
    </tr >

    // </div>
  );
};

export default InLineCategoryForm;
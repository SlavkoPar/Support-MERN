import { FormEvent, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, FormGroup } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { FormButtons } from "../../common/FormButtons"

import { ActionTypes, ICategoryFormProps } from "../types";

import { useCategoryDispatch } from "../Provider";

const InLineCategoryForm = ({ isEdit, initialValues, submitForm, children }: ICategoryFormProps) => {
  const { _id, level } = initialValues;

  const dispatch = useCategoryDispatch();

  const cancelForm = () => {
    dispatch({ type: isEdit ? ActionTypes.CANCEL_EDITING_FORM : ActionTypes.CANCEL_ADDING_FORM })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      // email: Yup.string()
      //   .email("You have enter an invalid email address")
      //   .required("Required"),
      // rollno: Yup.number()
      //   .positive("Invalid roll number")
      //   .integer("Invalid roll number")
      //   .required("Required"),
    }),
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      console.log('InLineCategoryForm.onSubmit', JSON.stringify(values, null, 2))
      submitForm(values)
      //props.handleClose(false);
    }
  });

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current!.focus()
  }, [titleRef])



  return (
    // <CloseButton onClick={closeForm} />

    <tr>
      <td>
        <FontAwesomeIcon color='orange' size='lg' icon={faCaretRight} />
      </td>
      <td title={_id!.toString()}>
        <Form onSubmit={formik.handleSubmit} ref={formRef}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              as="textarea"
              name="title"
              ref={titleRef}
              onChange={formik.handleChange}
              //onBlur={formik.handleBlur}
              //onBlur={(e: React.FocusEvent<HTMLTextAreaElement>): void => {
              // if (isEdit && formik.initialValues.title !== formik.values.title)
              // formik.submitForm();
              //}}

              value={formik.values.title}
              style={{ width: '100%' }}
              rows={2}
              placeholder={'New Category'}
            />
            <Form.Text className="text-danger">
              {formik.touched.title && formik.errors.title ? (
                <div className="text-danger">{formik.errors.title}</div>
              ) : null}
            </Form.Text>
          </Form.Group>
        </Form>
      </td>
      <td>
        <FormButtons
          cancelForm={cancelForm}
          handleSubmit={formik.handleSubmit}
          title={children}
        />
      </td>
    </tr >

  );
};

export default InLineCategoryForm;
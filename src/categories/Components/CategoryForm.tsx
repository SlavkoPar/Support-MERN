import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, FormGroup, CloseButton } from "react-bootstrap";
import { CreatedModifiedForm } from "../../common/CreateModifiedForm"
import { FormButtons } from "../../common/FormButtons"
import { ActionTypes, ICategoryFormProps } from "../types";

import { useCategoryDispatch } from "../Provider";

const CategoryForm = ({ isEdit, initialValues, submitForm, children }: ICategoryFormProps) => {

  const dispatch = useCategoryDispatch();

  const closeForm = () => {
    dispatch({ type: isEdit ? ActionTypes.CLOSE_EDITING_FORM : ActionTypes.CLOSE_ADDING_FORM })
  }

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
      console.log('CategoryForm.onSubmit', JSON.stringify(values, null, 2))
      submitForm(values)
      //props.handleClose(false);
    }
  });

  console.log(initialValues);
  // eslint-disable-next-line no-self-compare
  // const nameRef = useRef<HTMLAreaElement | null>(null);
  const nameRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    nameRef.current!.focus()
  }, [nameRef])

  return (
    <div className="form-wrapper">
      <CloseButton onClick={closeForm} className="float-end" />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            as="textarea"
            name="title"
            ref={nameRef}
            onChange={formik.handleChange}
            //onBlur={formik.handleBlur}
            // onBlur={(e: React.FocusEvent<HTMLTextAreaElement>): void => {
            //   if (isEdit && formik.initialValues.title !== formik.values.title)
            //     formik.submitForm();
            // }}
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

        {isEdit && 
          <CreatedModifiedForm created={initialValues.created} modified={initialValues.modified} />
        }
        <FormButtons
          cancelForm={cancelForm}
          handleSubmit={formik.handleSubmit}
          title={children}
        />
      </Form>
    </div >
  );
};

export default CategoryForm;
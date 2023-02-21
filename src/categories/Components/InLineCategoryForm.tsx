import { FormEvent, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { FormButtons } from "../../common/FormButtons"

import { useGlobalStore } from '../../GlobalStoreProvider'

import { ActionTypes, ICategoryFormProps } from "../types";

import { useCategoryDispatch } from "../Provider";

const InLineCategoryForm = ({ isEdit, initialValues, submitForm, children }: ICategoryFormProps) => {
  const { _id, level } = initialValues;

  const dispatch = useCategoryDispatch();
  const { authUser, isAuthenticated, variant, bg } = useGlobalStore();

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


    <ListGroup.Item
      variant={variant}
      className="py-1 px-1"
      as="li"
    >
      <div className="d-flex justify-content-start align-items-center">  {/* title={_id!.toString()} */}
        {/* <Button
          variant='link'
          size="sm"
          className="py-0 px-1"
          title="Expand"
          disabled
        >
          <FontAwesomeIcon icon={faCaretRight} color='orange' size='lg' />
        </Button> */}
        <Form onSubmit={formik.handleSubmit} ref={formRef}>
          <Form.Group controlId="title">
            {/* <Form.Label>Title</Form.Label> */}
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

        <FormButtons
          cancelForm={cancelForm}
          handleSubmit={formik.handleSubmit}
          title={children}
        />
      </div>
    </ListGroup.Item>
  );
};

export default InLineCategoryForm;
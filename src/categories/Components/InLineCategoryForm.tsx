import { FormEvent, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

import { FormButtons } from "../../common/FormButtons"

import { useGlobalState } from '../../global/GlobalProvider'

import { ActionTypes, FormMode, ICategoryFormProps } from "../types";

import { useCategoryDispatch } from "../Provider";

const InLineCategoryForm = ({ inLine, mode, initialValues, submitForm, children }: ICategoryFormProps) => {

  const viewing = mode === FormMode.viewing;
  const editing = mode === FormMode.editing;
  const adding = mode === FormMode.adding;
  
  const { _id, level } = initialValues;

  const dispatch = useCategoryDispatch();
  const{ authUser, isAuthenticated, variant, bg } = useGlobalState();

  const cancelForm = () => {
    dispatch({ type: ActionTypes.CANCEL_CATEGORY_FORM })
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
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current!.focus()
  }, [titleRef])

  return (
    // <ListGroup.Item
    //   variant={variant}
    //   className="py-1 px-1 w-100 border-0"
    //   as="li"
    // >
      <div className="d-flex justify-content-start align-items-center primary">  {/* title={_id!.toString()} */}
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
              as="input"
              name="title"
              ref={titleRef}
              onChange={formik.handleChange}
              //onBlur={formik.handleBlur}
              //onBlur={(e: React.FocusEvent<HTMLTextAreaElement>): void => {
              // if (isEdit && formik.initialValues.title !== formik.values.title)
              // formik.submitForm();
              //}}
              value={formik.values.title}
              style={{ color: 'orange', width: '100%' }}
              placeholder={'New Category'}
              size="sm"
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
    // </ListGroup.Item>
  );
};

export default InLineCategoryForm;
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, CloseButton } from "react-bootstrap";
import { CreatedModifiedForm } from "common/CreateModifiedForm"
import { FormButtons } from "common/FormButtons"
import { ActionTypes, FormMode, IQuestion, IQuestionFormProps } from "categories/types";

import { Select } from 'common/components/Select';
import { sourceOptions } from 'common/sourceOptions'
import { statusOptions } from 'common/statusOptions'

import { useCategoryDispatch } from "categories/Provider";

const QuestionForm = ({ mode, initialValues, submitForm, children }: IQuestionFormProps) => {

  const viewing = mode === FormMode.viewing;
  const editing = mode === FormMode.editing;
  const adding = mode === FormMode.adding;

  const dispatch = useCategoryDispatch();

  const closeForm = () => {
    dispatch({ type: ActionTypes.CLOSE_QUESTION_FORM, payload: {question: initialValues} })
  }

  const cancelForm = () => {
    dispatch({ type: ActionTypes.CANCEL_QUESTION_FORM, payload: { question: initialValues } })
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
    onSubmit: (values: IQuestion) => {
      //alert(JSON.stringify(values, null, 2));
      console.log('QuestionForm.onSubmit', JSON.stringify(values, null, 2))
      submitForm(values)
      //props.handleClose(false);
    }
  });

  // eslint-disable-next-line no-self-compare
  // const nameRef = useRef<HTMLAreaElement | null>(null);
  const nameRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    nameRef.current!.focus()
  }, [nameRef])

  const isDisabled = false; // !canEdit;

  return (
    <div className="form-wrapper px-3 py-0 my-0 mb-1 w-100">
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
            rows={2}
            placeholder='New Question'
            className="text-primary w-100"
            
          />
          <Form.Text className="text-danger">
            {formik.touched.title && formik.errors.title ? (
              <div className="text-danger">{formik.errors.title}</div>
            ) : null}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="source">
          <Form.Label>Source</Form.Label>
          <Select
            id="source"
            name="source"
            options={sourceOptions}
            onChange={(e, value) => {
              formik.setFieldValue('source', value)
                .then(() => { if (editing) formik.submitForm() })
            }}
            value={formik.values.source}
            disabled={isDisabled}
            classes="text-primary"
          />
          <Form.Text className="text-danger">
            {formik.touched.source && formik.errors.source ? (
              <div className="text-danger">{formik.errors.source}</div>
            ) : null}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Select
            id="status"
            name="status"
            options={statusOptions}
            //onChange={formik.handleChange}
            onChange={(e, value) => {
              formik.setFieldValue('status', value)
                .then(() => { if (editing) formik.submitForm() })
            }}
            value={formik.values.status}
            disabled={isDisabled}
            classes="text-primary"
          />
          <Form.Text className="text-danger">
            {formik.touched.status && formik.errors.status ? (
              <div className="text-danger">{formik.errors.status}</div>
            ) : null}
          </Form.Text>
        </Form.Group>

        {(viewing || editing) &&
          <CreatedModifiedForm
            created={initialValues.created}
            createdBy={initialValues.createdBy}
            modified={initialValues.modified}
            modifiedBy={initialValues.modifiedBy}
            classes="text-primary"
          />
        }
        {(editing || adding) &&
          <FormButtons
            cancelForm={cancelForm}
            handleSubmit={formik.handleSubmit}
            title={children}
          />
        }
      </Form>
    </div >
  );
};

export default QuestionForm;
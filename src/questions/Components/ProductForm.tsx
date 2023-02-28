import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, FormGroup, Button } from "react-bootstrap";
import { CreatedModifiedForm } from "../../common/CreateModifiedForm"
import { FormButtons } from "../../common/FormButtons"
import { ActionTypes, IQuestionFormProps } from "../types";

import { useQuestionDispatch } from "../QuestionProvider";

const ProductForm = ({ isEdit, initialValues, submitForm, children }: IQuestionFormProps) => {


  const dispatch = useQuestionDispatch();

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
      console.log('QuestionForm.onSubmit', JSON.stringify(values, null, 2))
      submitForm(values)
      //props.handleClose(false);
    }
  });

  // eslint-disable-next-line no-self-compare
  // const nameRef = useRef<HTMLAreaElement | null>(null);
  const nameRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    //nameRef.current!.focus()
  }, [nameRef])

  const isDisabled = false; // !canEdit;

  return (
    <div className="px-2 py-2">
      {/* <CloseButton onClick={closeForm} className="float-end" /> */}
      <Form onSubmit={formik.handleSubmit}>

        <div style={{ color: 'green', textAlign: 'center' }}>{initialValues.title}</div>

        <div style={{ color: 'green', textAlign: 'center' }}>$ 93.98 </div>

        <Button variant="primary" size="sm" type="button" className="ms-0" style={{ width: '100%', borderRadius: '3px' }} >
          Add to Cart
        </Button>

      </Form>
    </div >
  );
};

export default ProductForm;
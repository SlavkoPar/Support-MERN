import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, CloseButton } from "react-bootstrap";
import { ILoginUser } from "global/types";
import { useNavigate } from "react-router-dom";

import './formik.css';

import { useGlobalContext } from 'global/GlobalProvider'

export interface ILoginFormProps {
}


const LoginForm = () => {

  const { globalState, signInUser } = useGlobalContext();
  const { isAuthenticated } = globalState;

  let navigate = useNavigate();
  const closeForm = () => {
    navigate('/');
  }

  const submitForm = (loginUser: ILoginUser) => {
    signInUser(loginUser)
  }

  const initialValues: ILoginUser = {
    userName: '',
    password: ''
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object().shape({
      userName: Yup.string().required("Required"),
      password: Yup.string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters"),
    }),
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 2));
      submitForm(values)
    }
  });

  // eslint-disable-next-line no-self-compare
  // const nameRef = useRef<HTMLAreaElement | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current!.focus()
  }, [nameRef])

  useEffect(() => {
    if (isAuthenticated)
      navigate('/')
  }, [isAuthenticated, navigate])

  return (
    <div className="form">
      <CloseButton onClick={closeForm} className="float-end" />
      <Form onSubmit={formik.handleSubmit}>
        <span>Sign in</span>
        <Form.Group controlId="title">
          {/* <Form.Label>Title</Form.Label> */}
          <Form.Control
            as="input"
            name="userName"
            ref={nameRef}
            onChange={formik.handleChange}
            //onBlur={formik.handleBlur}
            // onBlur={(e: React.FocusEvent<HTMLTextAreaElement>): void => {
            //   if (isEdit && formik.initialValues.title !== formik.values.title)
            //     formik.submitForm();
            // }}
            value={formik.values.userName}
            style={{ width: '100%' }}
            placeholder={'Username'}
          />
          <Form.Text className="text-danger">
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-danger">{formik.errors.userName}</div>
            ) : null}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          {/* <Form.Label>password</Form.Label> */}
          <Form.Control
            as="input"
            name="password"
            type="password"
            onChange={formik.handleChange}
            //onBlur={formik.handleBlur}
            // onBlur={(e: React.FocusEvent<HTMLTextAreaElement>): void => {
            //   if (isEdit && formik.initialValues.title !== formik.values.title)
            //     formik.submitForm();
            // }}
            value={formik.values.password}
            style={{ width: '100%' }}
            placeholder={'pwd'}
          />
          <Form.Text className="text-danger">
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </Form.Text>
        </Form.Group>

        <button type="submit" className="submit-button">Sign in</button>

        {globalState.error &&
          <div>{globalState.error.message}</div>
        }

      </Form>

    </div >
  );
};

export default LoginForm;

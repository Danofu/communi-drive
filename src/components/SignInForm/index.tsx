import { FirebaseError } from 'firebase/app';
import { Formik, FormikConfig } from 'formik';
import { useContext } from 'react';
import { Keyboard } from 'react-native';
import * as Yup from 'yup';

import InnerForm from '@Components/SignInForm/InnerForm';
import { AuthContext, UserData } from '@Providers/AuthProvider';

type FormikSubmitHandler = FormikConfig<{ email: string; password: string }>['onSubmit'];

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email address is required'),
  password: Yup.string().min(9, 'Password should at least 9 characters long').required('Password is required'),
});

export type OnSubmit = (result: UserData | string | null) => void | Promise<void>;

type Props = { onSubmit?: OnSubmit };

export default function SignInForm({ onSubmit }: Props) {
  const authCtx = useContext(AuthContext);

  const submitHandler: FormikSubmitHandler = async ({ email, password }, helpers) => {
    Keyboard.dismiss();
    const [result, error] = await authCtx.signIn(email, password, true);
    if (!onSubmit) {
      return;
    }

    if (error) {
      let errorMessage = 'Something went wrong';
      if (error instanceof FirebaseError && ['auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
        errorMessage = 'Provided credentials are invalid';
      }

      helpers.setFieldValue('password', '');
      onSubmit(errorMessage);
      return;
    }

    onSubmit(result.user);
  };

  return (
    <Formik
      component={InnerForm}
      initialValues={{ email: '', password: '' }}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
    />
  );
}

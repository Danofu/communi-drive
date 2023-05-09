import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { Formik, FormikConfig } from 'formik';
import { useContext, useRef, useState } from 'react';
import { Keyboard, TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { AuthContext } from '@Providers/AuthProvider';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email address is required'),
  password: Yup.string().min(9, 'Password should at least 9 characters long').required('Password is required'),
});

type FormikSubmitHandler = FormikConfig<{ email: string; password: string }>['onSubmit'];

export type OnSubmit = (credential: UserCredential) => void | Promise<void>;
export type OnSubmitError = (message: string) => void | Promise<void>;

type Props = { onSubmit?: OnSubmit; onSubmitError?: OnSubmitError };

export default function SignInForm({ onSubmit, onSubmitError }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const authCtx = useContext(AuthContext);
  const passwordInputRef = useRef<RNTextInput>(null);

  const passwordVisibilityHandler = () => setIsPasswordVisible((isVisible) => !isVisible);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  const submitHandler: FormikSubmitHandler = async ({ email, password }, helpers) => {
    Keyboard.dismiss();
    const [credential, error] = await authCtx.signInUser(email, password);

    if (error) {
      let errorMessage = 'Something went wrong';
      if (error instanceof FirebaseError && ['auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
        errorMessage = 'Provided credentials are invalid';
        return;
      }

      helpers.setFieldValue('password', '');
      await onSubmitError?.(errorMessage);
      return;
    }

    await onSubmit?.(credential);
  };

  return (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={submitHandler} validationSchema={validationSchema}>
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => {
        return (
          <View style={styles.container}>
            <View style={styles.inputsContainer}>
              <View>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  autoFocus
                  blurOnSubmit={false}
                  error={touched.email && !!errors.email}
                  keyboardType="email-address"
                  label="Email *"
                  mode="outlined"
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  onSubmitEditing={emailEditedHandler}
                  placeholder="Your email ..."
                  value={values.email}
                />
                {touched.email && errors.email && <HelperText type="error">{errors.email}</HelperText>}
              </View>
              <View>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  error={touched.password && !!errors.password}
                  label="Password *"
                  mode="outlined"
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  placeholder="Your password ..."
                  ref={passwordInputRef}
                  right={
                    <TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={passwordVisibilityHandler} />
                  }
                  secureTextEntry={!isPasswordVisible}
                  value={values.password}
                />
                {touched.password && errors.password && <HelperText type="error">{errors.password}</HelperText>}
              </View>
            </View>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              {isSubmitting ? 'Signing In ...' : 'Sign In'}
            </Button>
          </View>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 32,
  },
  container: {
    width: '100%',
    marginVertical: 12,
  },
  inputsContainer: {
    gap: 12,
  },
});

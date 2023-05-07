import { Formik, FormikConfig } from 'formik';
import { useContext, useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { AuthContext } from '@Providers/AuthProvider';

type SubmitHandler = FormikConfig<{ email: string; password: string }>['onSubmit'];

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email address is required'),
  password: Yup.string().min(9, 'Password should at least 9 characters long').required('Password is required'),
});

export default function SignInForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const authCtx = useContext(AuthContext);
  const passwordInputRef = useRef<RNTextInput>(null);

  const passwordVisibilityHandler = () => setIsPasswordVisible((isVisible) => !isVisible);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  const submitHandler: SubmitHandler = async ({ email, password }, helpers) => {
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    const error = await authCtx.signInUser(email, password);

    if (error) {
      helpers.setFieldValue('password', '');
      helpers.setFieldTouched('password', false);
    } else {
      helpers.resetForm();
    }
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

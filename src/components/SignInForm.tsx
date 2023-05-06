import { Formik, FormikValues } from 'formik';
import { useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';

import { signInLocal } from '@Utils/firebase/firebase-auth';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email address is required'),
  password: Yup.string().min(9, 'Password should at least 9 characters long').required('Password is required'),
});

export default function SignInForm() {
  const passwordInputRef = useRef<RNTextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordVisibilityHandler = () => setIsPasswordVisible((isVisible) => !isVisible);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  const submitHandler = async (values: FormikValues) => {
    const { email, password } = values;
    console.log('[ SignInForm(submitHandler) ]:', await signInLocal(email, password));
  };

  return (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={submitHandler} validationSchema={validationSchema}>
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => {
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
            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              Continue
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

import { FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import TextInputWithHelperText from '@Components/SignInForm/TextInputWithHelperText';

type Props = FormikProps<{ email: string; password: string }>;

export default function InnerForm({
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  touched,
  values,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInputRef = useRef<RNTextInput>(null);

  const submitHandler = () => handleSubmit();

  const passwordVisibilityHandler = () => setIsPasswordVisible((isPrevVisible) => !isPrevVisible);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  return (
    <View style={styles.container}>
      <TextInputWithHelperText
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        autoFocus
        blurOnSubmit={false}
        error={touched.email && !!errors.email}
        helperText={errors.email}
        helperTextVisible={touched.email && !!errors.email}
        keyboardType="email-address"
        label="Email"
        mode="outlined"
        onBlur={handleBlur('email')}
        onChangeText={handleChange('email')}
        onSubmitEditing={emailEditedHandler}
        placeholder="Your email ..."
        required
        value={values.email}
      />
      <TextInputWithHelperText
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        error={touched.password && !!errors.password}
        helperText={errors.password}
        helperTextVisible={touched.password && !!errors.password}
        label="Password"
        mode="outlined"
        onBlur={handleBlur('password')}
        onChangeText={handleChange('password')}
        placeholder="Your password ..."
        ref={passwordInputRef}
        required
        right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={passwordVisibilityHandler} />}
        secureTextEntry={!isPasswordVisible}
        value={values.password}
      />
      <Button
        disabled={isSubmitting}
        loading={isSubmitting}
        mode="contained"
        onPress={submitHandler}
        style={styles.button}
      >
        {isSubmitting ? 'Signing In ...' : 'Sign In'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
  },
  container: {
    gap: 12,
    marginTop: 32,
    width: '100%',
  },
});

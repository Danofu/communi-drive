import { FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

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

  const passwordVisibilityHandler = () => setIsPasswordVisible((prevState) => !prevState);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  return (
    <View style={styles.container}>
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
          right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={passwordVisibilityHandler} />}
          secureTextEntry={!isPasswordVisible}
          value={values.password}
        />
        {touched.password && errors.password && <HelperText type="error">{errors.password}</HelperText>}
      </View>
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
    width: '100%',
    gap: 12,
    marginVertical: 24,
  },
  inputsContainer: {},
});

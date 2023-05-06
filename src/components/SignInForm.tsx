import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function SignInForm() {
  const passwordInputRef = useRef<RNTextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordVisibilityHandler = () => setIsPasswordVisible((isVisible) => !isVisible);

  const emailEditedHandler = () => passwordInputRef.current?.focus();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values) => console.log('[ SignInForm[Formik](onSubmit) ]: values:', values)}
    >
      {({ handleBlur, handleChange, handleSubmit, values }) => {
        const submitHandler = () => handleSubmit();

        return (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                autoFocus
                blurOnSubmit={false}
                keyboardType="email-address"
                label="Email"
                mode="outlined"
                onBlur={handleBlur('email')}
                onChangeText={handleChange('email')}
                onSubmitEditing={emailEditedHandler}
                placeholder="Your email ..."
                value={values.email}
              />
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                label="Password"
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
            </View>
            <Button mode="contained" onPress={submitHandler} style={styles.button}>
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
  inputContainer: {
    gap: 12,
  },
});

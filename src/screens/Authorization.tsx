import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';

import SignInForm from '@Components/SignInForm';
import elevation from '@Utils/elevation';

export default function Authorization() {
  const { colors } = useTheme();
  const [signInErrorMessage, setSignInErrorMessage] = useState<string>();

  const errorMassageDismissHandler = () => setSignInErrorMessage(undefined);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <KeyboardAvoidingView behavior="position" style={{ width: '100%' }}>
          <View style={styles.formContainer}>
            <Text style={styles.headerText} variant="headlineMedium">
              Welcome
            </Text>
            <SignInForm onError={setSignInErrorMessage} />
          </View>
        </KeyboardAvoidingView>
        <Snackbar
          onDismiss={errorMassageDismissHandler}
          style={{ backgroundColor: colors.error }}
          visible={!!signInErrorMessage}
        >
          <Text style={{ color: colors.errorContainer }}>{signInErrorMessage}</Text>
        </Snackbar>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    ...elevation(3),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  headerText: {
    marginVertical: 16,
    textAlign: 'center',
  },
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});

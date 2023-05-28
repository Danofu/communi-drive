import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';

import SignInForm, { OnSubmit } from '@Components/SignInForm';
import ErrorSnackbar from '@Components/UI/ErrorSnackbar';
import elevation from '@Utils/elevation';
import { StackParamList } from 'App';

type Props = NativeStackScreenProps<StackParamList, 'Authorization'>;

export default function Authorization({ navigation }: Props) {
  const [authError, setAuthError] = useState<string | null>(null);

  const signInSubmitHandler: OnSubmit = (result) => {
    if (typeof result === 'string') {
      setAuthError(result);
      return;
    }

    if (result) {
      navigation.replace(result.role === 'dispatcher' ? 'ManageRoutes' : 'DriverMap');
    }
  };

  const errorDismissHandler = () => setAuthError(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <KeyboardAvoidingView behavior="position" style={{ width: '100%' }}>
          <View style={styles.formContainer}>
            <Text style={styles.headerText} variant="headlineMedium">
              Sign In
            </Text>
            <SignInForm onSubmit={signInSubmitHandler} />
          </View>
        </KeyboardAvoidingView>
        <ErrorSnackbar onDismiss={errorDismissHandler} visible={!!authError}>
          {authError}
        </ErrorSnackbar>
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
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: '100%',
  },
  headerText: {
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

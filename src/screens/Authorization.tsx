import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import SignInForm from '@Components/SignInForm';
import elevation from '@Util/elevation';

export default function Authorization() {
  return (
    <View style={styles.root}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText} variant="headlineMedium">
          Sign In
        </Text>
        <SignInForm />
      </View>
    </View>
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

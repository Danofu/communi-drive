import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, IconButtonProps, Tooltip } from 'react-native-paper';

import SignOutDialog from '@Components/SignOut/SignOutDialog';
import { AuthContext } from '@Providers/AuthProvider';
import { StackParamList } from 'App';

type Props = { iconColor?: IconButtonProps['iconColor']; navigation: NativeStackNavigationProp<StackParamList> };

export default function HeaderSignOutButton({ iconColor, navigation }: Props) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { signOut } = useContext(AuthContext);

  const buttonPressHandler = () => setIsDialogVisible(true);

  const dialogDismissHandler = () => setIsDialogVisible(false);

  const signOutHandler = async () => {
    setIsDialogVisible(false);
    await signOut();
    navigation.replace('Authorization');
  };

  return (
    <>
      <Tooltip title="Sign Out">
        <IconButton icon="logout" iconColor={iconColor} onPress={buttonPressHandler} style={styles.button} />
      </Tooltip>
      <SignOutDialog onDismiss={dialogDismissHandler} onSignOut={signOutHandler} visible={isDialogVisible} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
});

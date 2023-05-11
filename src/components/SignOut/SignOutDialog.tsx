import { Button, Dialog, DialogProps, Text, useTheme } from 'react-native-paper';

import DialogBase from '@Components/UI/DialogBase';

type Props = { onDismiss?: DialogProps['onDismiss']; onSignOut?: () => void; visible: DialogProps['visible'] };

export default function SignOutDialog({ onDismiss, onSignOut, visible }: Props) {
  const { colors } = useTheme();

  return (
    <DialogBase onDismiss={onDismiss} visible={visible}>
      <Dialog.Title>Sign Out</Dialog.Title>
      <Dialog.Content>
        <Text>Are you sure you want to sign out ?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onSignOut} textColor={colors.error}>
          Sign Out
        </Button>
      </Dialog.Actions>
    </DialogBase>
  );
}

import { PropsWithChildren } from 'react';
import { Snackbar, SnackbarProps, Text, useTheme } from 'react-native-paper';

export type Props = PropsWithChildren<{ onDismiss: SnackbarProps['onDismiss']; visible: SnackbarProps['visible'] }>;

export default function ErrorSnackbar({ children, onDismiss, visible }: Props) {
  const { colors } = useTheme();

  return (
    <Snackbar onDismiss={onDismiss} style={{ backgroundColor: colors.error }} visible={visible}>
      <Text style={{ color: colors.errorContainer }}>{children}</Text>
    </Snackbar>
  );
}

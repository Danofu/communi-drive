import { PropsWithChildren } from 'react';
import { Dialog, DialogProps, Portal } from 'react-native-paper';

type Props = PropsWithChildren<{ onDismiss?: DialogProps['onDismiss']; visible: DialogProps['visible'] }>;

export default function DialogBase({ children, onDismiss, visible }: Props) {
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} visible={visible}>
        {children}
      </Dialog>
    </Portal>
  );
}

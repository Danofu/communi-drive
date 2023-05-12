import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import elevation from '@Utils/elevation';

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export default function SectionCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    ...elevation(1),
    backgroundColor: 'white',
    padding: 15,
    width: '100%',
  },
});

import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import elevation from '@Utils/elevation';

export default function SectionCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    ...elevation(3),
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
  },
});

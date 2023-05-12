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
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '100%',
  },
});

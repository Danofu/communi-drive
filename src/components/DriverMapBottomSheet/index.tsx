import BottomSheet from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Places } from '@Components/Places/PlacesList';

type Props = { places?: Places };

export default function DriverMapBottomSheet({ places = {} }: Props) {
  return (
    <BottomSheet animateOnMount index={0} snapPoints={[60, '50%', '98%']} style={styles.root}>
      <View style={styles.contentContainer}>
        <Text variant="headlineMedium">Hello from Driver Map Bottom Sheet</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 11,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
});

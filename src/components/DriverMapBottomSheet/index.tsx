import BottomSheet from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function DriverMapBottomSheet() {
  return (
    <BottomSheet animateOnMount enablePanDownToClose index={1} snapPoints={[60, '50%', '100%']} style={styles.root}>
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

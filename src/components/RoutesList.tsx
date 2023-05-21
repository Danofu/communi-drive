import { View, StyleSheet, FlatListProps, FlatList } from 'react-native';
import { Text } from 'react-native-paper';

type Props<T> = { data: FlatListProps<T>['data'] };

export default function RoutesList<T>({ data }: Props<T>) {
  let content = <FlatList data={data} renderItem={() => null} />;

  if (!data?.length) {
    content = <Text variant="titleLarge">No routes found. Try adding one.</Text>;
  }

  return <View style={styles.root}>{content}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

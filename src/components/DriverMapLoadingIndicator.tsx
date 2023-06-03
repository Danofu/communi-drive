import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

type Props = {
  loading?: boolean;
};

export default function DriverMapLoadingIndicator({ loading = false }: Props) {
  const theme = useTheme();

  if (!loading) {
    return null;
  }

  return (
    <React.Fragment>
      <View style={[styles.backdrop, { backgroundColor: theme.colors.background }]} />
      <ActivityIndicator animating size="large" style={styles.indicator} />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    bottom: 0,
    left: 0,
    opacity: 0.8,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  indicator: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
});

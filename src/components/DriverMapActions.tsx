import { useForegroundPermissions } from 'expo-location';
import { Moment } from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, ToggleButton, ToggleButtonProps, Tooltip, useTheme } from 'react-native-paper';

import DatePicker from '@Components/DatePicker';
import { type Props as DatePickerProps } from '@Components/DatePicker/types';
import elevation from '@Utils/elevation';

export type Props = {
  date: Moment;
  isDirecting: boolean;
  isFollowing: boolean;
  onDatePicked?: DatePickerProps['onChange'];
  onDirectToggle?: () => void;
  onFollowToggle?: () => void;
};

export default function DriverMapActions({
  date,
  isDirecting,
  isFollowing,
  onDatePicked,
  onDirectToggle,
  onFollowToggle,
}: Props) {
  const [permissionInfo] = useForegroundPermissions();
  const { colors } = useTheme();

  const followPressHandler: ToggleButtonProps['onPress'] = onFollowToggle;

  const directPressHandler: ToggleButtonProps['onPress'] = onDirectToggle;

  return (
    <View style={styles.root}>
      <View style={styles.buttonsContainer}>
        {permissionInfo?.granted && (
          <React.Fragment>
            <View
              style={[
                styles.directionButtonContainer,
                {
                  backgroundColor: isDirecting ? colors.primaryContainer : colors.background,
                  borderColor: colors.primaryContainer,
                },
                isDirecting && styles.directionButtonActive,
              ]}
            >
              <Tooltip title="Find Route">
                <ToggleButton
                  icon="directions"
                  iconColor={colors.primary}
                  onPress={directPressHandler}
                  style={styles.directionButton}
                />
              </Tooltip>
            </View>
            <View
              style={[
                styles.followButtonContainer,
                {
                  backgroundColor: isFollowing ? colors.primaryContainer : colors.background,
                  borderColor: colors.primaryContainer,
                },
                isFollowing && styles.followButtonActive,
              ]}
            >
              <Tooltip title="Track my location in real-time">
                <ToggleButton
                  icon={isFollowing ? 'pause' : 'play'}
                  iconColor={colors.primary}
                  onPress={followPressHandler}
                  style={styles.followButton}
                />
              </Tooltip>
            </View>
          </React.Fragment>
        )}
      </View>
      <DatePicker onChange={onDatePicked} style={styles.datePicker} value={date} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  datePicker: {
    opacity: 0.7,
  },
  directionButton: {
    borderRadius: 24,
  },
  directionButtonActive: {
    opacity: 1,
  },
  directionButtonContainer: {
    ...elevation(3),
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.7,
  },
  followButton: {
    borderRadius: 24,
  },
  followButtonActive: {
    opacity: 1,
  },
  followButtonContainer: {
    ...elevation(3),
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.7,
  },
  root: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 10,
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

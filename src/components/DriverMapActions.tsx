import { useForegroundPermissions } from 'expo-location';
import { Moment } from 'moment';
import { StyleSheet, View } from 'react-native';
import { ToggleButton, ToggleButtonProps, Tooltip, useTheme } from 'react-native-paper';

import DatePicker from '@Components/DatePicker';
import elevation from '@Utils/elevation';

import type { Props as DatePickerProps } from '@Components/DatePicker/types';

export type Props = {
  date: Moment;
  isFollowing: boolean;
  onDatePicked?: DatePickerProps['onChange'];
  onFollowToggle?: () => void;
};

export default function DriverMapActions({ date, isFollowing, onDatePicked, onFollowToggle }: Props) {
  const [permissionInfo] = useForegroundPermissions();
  const { colors } = useTheme();

  const followPressHandler: ToggleButtonProps['onPress'] = onFollowToggle;

  return (
    <View style={styles.root}>
      {permissionInfo?.granted && (
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
      )}
      <DatePicker onChange={onDatePicked} style={styles.datePicker} value={date} />
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
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

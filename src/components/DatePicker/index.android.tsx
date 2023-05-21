import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { StyleSheet, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

import type { Props } from '@Components/DatePicker/types';

export default function DatePicker({ onChange, style, value }: Props) {
  const { colors } = useTheme();

  const dateChangeHandler = (_: DateTimePickerEvent, date?: Date) => {
    if (date && onChange) {
      onChange(moment(date));
    }
  };

  const openPickerHandler = () =>
    DateTimePickerAndroid.open({
      display: 'calendar',
      mode: 'date',
      negativeButton: { textColor: colors.secondary },
      onChange: dateChangeHandler,
      positiveButton: { label: 'Set', textColor: colors.primary },
      value: value.toDate(),
    });

  return (
    <View style={[styles.root, style]}>
      <Chip compact onPress={openPickerHandler}>
        {value.format('D MMM YYYY')}
      </Chip>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

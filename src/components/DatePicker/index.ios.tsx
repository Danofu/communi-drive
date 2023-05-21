import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import type { Props } from '@Components/DatePicker/types';

export default function DatePicker({ onChange, style, value }: Props) {
  const { colors } = useTheme();

  const dateChangeHandler = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== 'set') {
      return;
    }

    if (onChange && date) {
      onChange(moment(date));
    }
  };

  return (
    <View style={[styles.root, style]}>
      <DateTimePicker
        accentColor={colors.primary}
        onChange={dateChangeHandler}
        textColor={colors.primaryContainer}
        value={value.toDate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

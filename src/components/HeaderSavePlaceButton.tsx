import { StyleSheet } from 'react-native';
import { IconButton, IconButtonProps, Tooltip } from 'react-native-paper';

type Props = {
  disabled?: IconButtonProps['disabled'];
  iconColor?: IconButtonProps['iconColor'];
  onPress?: IconButtonProps['onPress'];
};

export default function HeaderSavePlaceButton({ disabled, iconColor, onPress }: Props) {
  return (
    <Tooltip title="Save Place">
      <IconButton
        disabled={disabled}
        icon="content-save"
        iconColor={iconColor}
        onPress={onPress}
        style={styles.button}
      />
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
});

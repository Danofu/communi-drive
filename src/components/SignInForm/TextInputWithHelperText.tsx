import { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

type Props = TextInputProps & { helperText?: ReactNode; helperTextVisible?: boolean; required?: boolean };

export default function TextInputWithHelperText({
  helperText,
  helperTextVisible = false,
  label,
  required = false,
  ...props
}: Props) {
  const labelWithRequiredIndicator: ReactElement = (
    <>
      {label}
      {required && ' *'}
    </>
  );

  return (
    <View>
      <TextInput label={labelWithRequiredIndicator} {...props} />
      {helperTextVisible && <HelperText type="error">{helperText}</HelperText>}
    </View>
  );
}

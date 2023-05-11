import { PropsWithRef, ReactElement, ReactNode, forwardRef } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

type Props = PropsWithRef<TextInputProps & { helperText?: ReactNode; helperTextVisible?: boolean; required?: boolean }>;

export default forwardRef<RNTextInput, Props>(function TextInputWithHelperText(
  { helperText, helperTextVisible = false, label, required = false, ...props },
  ref
) {
  const labelWithRequiredIndicator: ReactElement = (
    <>
      {label}
      {required && ' *'}
    </>
  );

  return (
    <View>
      <TextInput label={labelWithRequiredIndicator} ref={ref} {...props} />
      {helperTextVisible && <HelperText type="error">{helperText}</HelperText>}
    </View>
  );
});

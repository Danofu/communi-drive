import { Moment } from 'moment';
import { StyleProp, ViewStyle } from 'react-native';

export type ChangeHandler = (date: Moment) => void;

export type Props = { onChange?: ChangeHandler; style?: StyleProp<ViewStyle>; value: Moment };

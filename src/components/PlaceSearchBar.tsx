import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, SearchbarProps } from 'react-native-paper';

export type Props = { onPlaceSearch?: (place: string) => Promise<void> | void };

export default function PlaceSearchBar({ onPlaceSearch }: Props) {
  const [enteredPlace, setEnteredPlace] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const iconPressHandler: SearchbarProps['onIconPress'] = () => onPlaceSearch && onPlaceSearch(enteredPlace);

  const submitEditingHandler: SearchbarProps['onSubmitEditing'] = () => onPlaceSearch && onPlaceSearch(enteredPlace);

  const focusHandler: SearchbarProps['onFocus'] = () => setIsFocused(true);

  const blurHandler: SearchbarProps['onBlur'] = () => setIsFocused(false);

  return (
    <View style={[styles.root, isFocused && styles.focused]}>
      <Searchbar
        autoCapitalize="none"
        autoCorrect={false}
        inputStyle={styles.searchBarInput}
        onBlur={blurHandler}
        onChangeText={setEnteredPlace}
        onFocus={focusHandler}
        onIconPress={iconPressHandler}
        onSubmitEditing={submitEditingHandler}
        placeholder="Search for a place ..."
        style={styles.searchBar}
        value={enteredPlace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  focused: {
    opacity: 1,
  },
  root: {
    opacity: 0.7,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    width: '100%',
  },
  searchBar: {},
  searchBarInput: {},
});

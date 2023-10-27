import React, {useContext} from 'react';
import {TextInput} from 'react-native';
import {AppContext} from '../../context';
import {styles} from '../style';

interface SearchBarProps {
  value: string;
  onChangeText: any;
  onFocus?: any;
  onBlur?: any;
  placeholder: string;
  style?: object;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  style,
}) => {
  const {theme} = useContext(AppContext);

  return (
    <TextInput
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles(theme).inputSearchcontainer, style]}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={theme.text02}
      onChangeText={onChangeText}
    />
  );
};

export default SearchBar;

import React, {useContext} from 'react';
import {MentionSuggestionsProps} from 'react-native-controlled-mentions';
import {AppContext} from '../../context';
import {Text, TouchableOpacity, View} from 'react-native';
import {NativeImage} from './NativeImage';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

const Suggestions: (suggestions: any[]) => React.FC<MentionSuggestionsProps> =
  suggestions =>
  ({keyword, onSuggestionPress}) => {
    const theme = useContext(AppContext).theme;
    if (keyword == null) {
      return null;
    }

    return (
      <View>
        {suggestions.map(one => (
          <TouchableOpacity
            key={one.id.toString()}
            activeOpacity={0.9}
            onPress={() => onSuggestionPress(one)}
            style={[
              {
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'space-between',
                marginVertical: 5,
              },
            ]}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                },
              ]}>
              <NativeImage
                uri={one.avatar}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 30,
                  backgroundColor: theme.placeholder,
                }}
              />
              <Text
                style={[
                  {
                    ...FontWeights.Regular,
                    ...FontSizes.Caption,
                    color: theme.text01,
                    alignItems: 'center',
                    marginLeft: 10,
                  },
                ]}>
                {one.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

export default Suggestions;

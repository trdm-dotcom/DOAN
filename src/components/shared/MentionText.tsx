import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {Text} from 'react-native';
import {
  Part,
  PartType,
  isMentionPartType,
  parseValue,
} from 'react-native-controlled-mentions';

const renderPart = (part: Part, index: number, user: any) => {
  const navigation = useNavigation();
  // Just plain text
  if (!part.partType) {
    return <Text key={index}>{part.text}</Text>;
  }

  // Mention type part
  if (isMentionPartType(part.partType)) {
    return (
      <Text
        key={`${index}-${part.data?.trigger}`}
        style={part.partType.textStyle}
        onPress={() => {
          const mentionId = part.data?.id;
          if (mentionId === user.id) {
            navigation.navigate('MyProfile');
          } else {
            navigation.navigate('Profile', {userId: mentionId});
          }
        }}>
        {part.text}
      </Text>
    );
  }

  // Other styled part types
  return (
    <Text key={`${index}-pattern`} style={part.partType.textStyle}>
      {part.text}
    </Text>
  );
};

const renderValue = (value: string, partTypes: PartType[], user: any) => {
  const {parts} = parseValue(value, partTypes);

  return (
    <Text>{parts.map((part, index) => renderPart(part, index, user))}</Text>
  );
};

export default renderValue;

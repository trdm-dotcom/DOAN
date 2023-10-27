import React, {useContext} from 'react';
import {Composer} from 'react-native-gifted-chat';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

const CustomComposer = composerProps => {
  const {theme} = useContext(AppContext);
  return (
    <Composer
      {...composerProps}
      multiline
      textInputStyle={[
        {
          ...FontWeights.Light,
          ...FontSizes.Body,
          color: theme.text01,
          paddingTop: 10,
          paddingLeft: 10,
        },
      ]}
    />
  );
};

export default CustomComposer;

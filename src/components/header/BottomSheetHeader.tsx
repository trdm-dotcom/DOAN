import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {ThemeColors} from '../../constants/Types';

const {FontWeights, FontSizes} = Typography;

type BottomSheetHeaderProps = {
  heading: string;
  subHeading?: string;
};

const BottomSheetHeader = ({heading, subHeading}: BottomSheetHeaderProps) => {
  const {theme} = useContext(AppContext);
  return (
    <View style={styles().container}>
      <Text style={styles(theme).heading}>{heading}</Text>
      {subHeading && <Text style={styles(theme).subHeading}>{subHeading}</Text>}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {},
    heading: {
      ...FontWeights.Bold,
      ...FontSizes.Heading,
      color: theme.text01,
    },
    subHeading: {
      ...FontWeights.Regular,
      ...FontSizes.Caption,
      marginTop: 2,
      color: theme.text02,
    },
  });

export default BottomSheetHeader;

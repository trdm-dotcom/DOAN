import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Placeholder, PlaceholderLine} from 'rn-placeholder';
import PlaceholderAnimation from './PlaceholderAnimation';
import {AppContext} from '../../context';
import {PostDimensions} from '../../constants/Constants';

const EditPostScreenPlaceholder: React.FC = () => {
  const {theme} = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Placeholder Animation={PlaceholderAnimation}>
        <PlaceholderLine
          noMargin
          color={theme.placeholder}
          height={PostDimensions.Large.height}
          style={styles.card}
        />
      </Placeholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingHorizontal: 20,
  },
  card: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default EditPostScreenPlaceholder;

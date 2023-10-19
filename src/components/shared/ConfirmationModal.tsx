import React, {useContext} from 'react';
import {AppContext} from '../../context';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import AppButton from '../control/AppButton';
import {ThemeColors} from '../../constants/Types';
import Typography from '../../theme/Typography';
import {IconSizes} from '../../constants/Constants';
import {space} from '../../components/style';

const {FontWeights, FontSizes} = Typography;

type ConfirmationModalProps = {
  title: string;
  isVisible: boolean;
  toggle: () => void;
  label: string;
  color?: string;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  title,
  isVisible,
  toggle,
  label,
  color,
  onConfirm,
}: ConfirmationModalProps) => {
  const {theme} = useContext(AppContext);

  return (
    <Modal
      useNativeDriver
      animationInTiming={400}
      animationOutTiming={400}
      hideModalContentWhileAnimating
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={toggle}>
      <View style={styles(theme).container}>
        <Text style={styles(theme).heading}>{title}</Text>
        <AppButton
          label={label}
          onPress={onConfirm}
          loading={false}
          containerStyle={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: IconSizes.x5,
            },
            space(IconSizes.x5).mt,
          ]}
          labelStyle={{color: color || theme.accent}}
        />
        <AppButton
          label="Cancel"
          onPress={toggle}
          loading={false}
          labelStyle={{color: theme.text02}}
          containerStyle={[
            space(IconSizes.x5).mt,
            {backgroundColor: theme.base},
          ]}
        />
      </View>
    </Modal>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: theme.base,
    },
    heading: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: theme.text01,
    },
  });

export default ConfirmationModal;

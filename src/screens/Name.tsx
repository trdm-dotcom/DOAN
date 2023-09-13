import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TextInput,
} from 'react-native';
import {colors, styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {PressableOpacity} from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'Name'>;

const Name = ({navigation, route}: props) => {
  const {createAccount, phoneNumber} = route.params;
  const [name, setName] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  const isValidData = () => {
    const error = checkEmpty(name, 'Please enter your name');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    setIsContinue(verify);
    if (verify) {
      setName(text.trim());
    }
  };

  const handleContinue = () => {
    if (isValidData()) {
      navigation.navigate('Password', {
        createAccount: createAccount,
        name: name,
        phoneNumber: phoneNumber,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          styles.alignItemsCenter,
          styles.justifyContentCenter,
        ]}>
        <Text style={[styles.boldText, styles.centerText, styles.h2]}>
          What's your name?
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            textAlign="center"
            placeholder="Your name"
            placeholderTextColor={colors.dark}
          />
        </View>
        <View style={[styles.fullWidth, styles.displayBottom]}>
          <PressableOpacity
            onPress={handleContinue}
            style={[styles.buttonPrimary, styles.fullWidth]}
            disabled={!isContinue}
            disabledOpacity={0.4}>
            <Text style={[styles.boldText, styles.centerText, styles.h4]}>
              Continue
            </Text>
          </PressableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Name;

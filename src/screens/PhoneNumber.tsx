import React, {useRef, useState} from 'react';
import {KeyboardAvoidingView, SafeAreaView, Text, View} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {PressableOpacity} from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'PhoneNumber'>;

const PhoneNumber = ({navigation, route}: props) => {
  const {createAccount} = route.params;
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  const isValidData = () => {
    const error = checkEmpty(phoneNumber, 'Please enter your phome number');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnChangeFormattedText = (text: string) => {
    const isVerified = phoneInput.current?.isValidNumber(text) || false;
    setIsContinue(isVerified);
    if (isVerified) {
      setPhoneNumber(
        phoneInput.current?.getNumberAfterPossiblyEliminatingZero().number ||
          '',
      );
    }
  };

  const handleContinue = () => {
    if (isValidData()) {
      if (createAccount) {
        navigation.navigate('Name', {
          createAccount: createAccount,
          phoneNumber: phoneNumber,
        });
      } else {
        navigation.navigate('Password', {
          createAccount: createAccount,
          phoneNumber: phoneNumber,
        });
      }
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
          What's your mobile number?
        </Text>
        <View style={styles.inputContainer}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="VN"
            layout="first"
            onChangeFormattedText={handleOnChangeFormattedText}
            textInputStyle={[styles.boldText, styles.h2]}
            codeTextStyle={[styles.boldText, styles.h2]}
            containerStyle={[styles.phoneNumberView]}
            textContainerStyle={[styles.inputField, {paddingVertical: 0}]}
            autoFocus
          />
        </View>
        {!createAccount && (
          <PressableOpacity
            onPress={() =>
              navigation.replace('Mail', {
                createAccount: createAccount,
              })
            }
            style={[styles.buttonDark]}>
            <Text style={[styles.boldText, styles.centerText, styles.h4]}>
              Use email instead
            </Text>
          </PressableOpacity>
        )}
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

export default PhoneNumber;

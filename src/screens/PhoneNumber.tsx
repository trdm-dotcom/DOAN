import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import DeviceNumber from 'react-native-device-number';
import {styles} from '../components/style';

const PhoneNumber = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  useEffect(() => {
    DeviceNumber.get();
  }, []);

  const handleOnChangeFormattedText = (text: string) => {
    const isVerified = phoneInput.current?.isValidNumber(text) || false;
    setIsContinue(isVerified);
    if (isVerified) {
      setPhoneNumber(text);
    }
  };

  const handleContinue = () => {};

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.topText, styles.boldText, styles.h2]}>
            Doan.
          </Text>
          <View>
            <Text style={[styles.boldText, styles.centerText, styles.h2]}>
              What's your number?
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
                textContainerStyle={[styles.inputField]}
                autoFocus
              />
            </View>
          </View>
          <View style={[styles.fullWidthButton, styles.bottomButton]}>
            <Pressable
              onPress={handleContinue}
              style={styles.buttonPrimary}
              disabled={!isContinue}>
              <Text style={[styles.boldText, styles.centerText, styles.h3]}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneNumber;

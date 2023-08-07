import React, {useEffect, useState} from 'react';

import {
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Text,
  View,
  Pressable,
} from 'react-native';
import { styles } from '../components/style';

const Otp = () => {
  const [otpValue, setOtpValue] = useState('');
  const [otpId, setOtpId] = useState('');
  const [isContinue, setIsContinue] = useState(false);

  const getOtp = async () => {};

  useEffect(() => {
    getOtp();
  }, []);

  const handleOnChangeText = (text: string) => {
    setIsContinue(text.length > 0);
  };

  const handleContinue = () => {};

  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.topText, styles.boldText, styles.h2]}>
            DOAN.
          </Text>
          <Text style={[styles.boldText, styles.centerText, styles.h2]}>
            Waiting for OTP
          </Text>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            secureTextEntry
            textAlign="center"
            placeholder="Code"
          />
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

export default Otp;

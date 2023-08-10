/* eslint-disable react-hooks/exhaustive-deps */
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
import { useAppDispatch, useAppSelector } from '../reducers/store';
import { getOtp, verifyOtp } from '../reducers/otp.reducer';
import { OtpIdType } from '../models/enum/OtpIdType';
import { OtpTxtType } from '../models/enum/OtpTxtType';
import IOtpResponse from '../models/response/IOtpResponse';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import { register } from '../reducers/authentications.reducer';
import { RootStackParamList } from '../navigators/RootStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getHash } from '../utils/Crypto';
import { checkEmpty } from '../utils/Validate';
import { showError } from '../utils/Toast';

type props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const Otp = ({navigation, route}: props) => {
  const dispatch = useAppDispatch();
  const {createAccount, name, phoneNumber, password} = route.params;
  const [otpValue, setOtpValue] = useState('');
  const [otpId, setOtpId] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [isContinue, setIsContinue] = useState(false);

  const dataGetOtp = useAppSelector((state) => state.otp.dataGetOtp) as IOtpResponse;
  const dataVerifyOtp = useAppSelector((state) => state.otp.dataVerifyOtp) as IVerifyOtpResponse;

  useEffect(() => {
    dispatch(getOtp({id: "", idType: OtpIdType.FIREBASE, txtType: OtpTxtType.VERIFY}));
  }, []);

  useEffect(() => {
    setOtpId(dataGetOtp.otpId);
  }, [dataGetOtp]);

  useEffect(() => {
    const otpKey = dataVerifyOtp.otpKey;
    if (createAccount) {
      dispatch(register({username: phoneNumber, password: password, name: name, otpKey: otpKey, hash: getHash('REGISTER')}));
      navigation.navigate('Home');
    }
  }, [dataVerifyOtp]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          setIsContinue(false);
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  const isValidData = () => {
    const error = checkEmpty(otpValue, 'Please enter code');
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
      setOtpValue(text.trim());
    }
  };

  const resendOtp = () => {
    setOtpValue('');
    setOtpId('');
  };

  const handleContinue = () => {
    if (isValidData()) {
      dispatch(verifyOtp({otpId: otpId, otpValue: otpValue}));
    }
  };

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
          <View>
            {seconds > 0 || minutes > 0 ? (
              <Text style={[styles.normalText, styles.centerText]}>Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:</Text>
            ) :
            (
              <Pressable onPress={resendOtp}>
                <Text style={[styles.normalText, styles.centerText]}>Resend OTP</Text>
              </Pressable>
            )}
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

export default Otp;

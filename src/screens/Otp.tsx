/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';

import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
  TextInput,
} from 'react-native';
import {colors, styles} from '../components/style';
import {useAppDispatch, useAppSelector} from '../reducers/store';
import {OtpIdType} from '../models/enum/OtpIdType';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import IOtpResponse from '../models/response/IOtpResponse';
import {register} from '../reducers/authentications.reducer';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getHash} from '../utils/Crypto';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import {getOtp, verifyOtp} from '../reducers/otp.reducer';
import {AxiosResponse} from 'axios';
import {PressableOpacity} from 'react-native-pressable-opacity';

type props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const Otp = ({navigation, route}: props) => {
  const dispatch = useAppDispatch();
  const {createAccount, name, phoneNumber, password} = route.params;
  const [otpValue, setOtpValue] = useState('');
  const [otpId, setOtpId] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [isContinue, setIsContinue] = useState(false);

  const loading = useAppSelector(state => state.otp.loading);

  useEffect(() => {
    dispatch(
      getOtp({id: '', idType: OtpIdType.FIREBASE, txtType: OtpTxtType.VERIFY}),
    )
      .unwrap()
      .then((response: AxiosResponse<IOtpResponse>) => {
        setOtpId(response.data.otpId);
      });
  }, []);

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

  const handleContinue = async () => {
    if (isValidData()) {
      const response: AxiosResponse<IVerifyOtpResponse> = await dispatch(
        verifyOtp({otpId: otpId, otpValue: otpValue}),
      ).unwrap();
      if (createAccount) {
        dispatch(
          register({
            username: phoneNumber,
            password: password,
            name: name,
            otpKey: response.data.otpKey,
            hash: getHash('REGISTER'),
          }),
        );
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
          Waiting for OTP
        </Text>
        <View style={[styles.inputContainer]}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[styles.inputField, styles.boldText, styles.h2]}
            autoFocus
            textAlign="center"
            placeholder="Code"
            placeholderTextColor={colors.dark}
          />
        </View>
        {seconds > 0 || minutes > 0 ? (
          <Text style={[styles.normalText, styles.centerText]}>
            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
          </Text>
        ) : (
          <PressableOpacity onPress={resendOtp}>
            <Text style={[styles.normalText, styles.centerText]}>
              Resend OTP
            </Text>
          </PressableOpacity>
        )}
        <View style={[styles.fullWidth, styles.displayBottom]}>
          <PressableOpacity
            onPress={handleContinue}
            style={[styles.buttonPrimary, styles.fullWidth]}
            disabled={!isContinue || loading}
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

export default Otp;

import React, {useContext, useEffect, useState} from 'react';

import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {space, styles} from '../components/style';
import {OtpIdType} from '../models/enum/OtpIdType';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import IOtpResponse from '../models/response/IOtpResponse';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import {apiPost} from '../utils/Api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBar from '../components/header/HeaderBar';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {AppContext} from '../context';
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import LoadingIndicator from '../components/shared/LoadingIndicator';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const Otp = ({navigation, route}: props) => {
  const {theme, fcmToken} = useContext(AppContext);
  const {phoneNumber, otpId} = route.params;
  const [otpValue, setOtpValue] = useState<string>('');
  const [otp, setOtp] = useState<string>(otpId);
  const [minutes, setMinutes] = useState<number>(1);
  const [seconds, setSeconds] = useState<number>(30);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getOtp = async () => {
    try {
      setLoading(true);
      const body = {
        id: phoneNumber ? phoneNumber : fcmToken,
        idType: phoneNumber ? OtpIdType.SMS : OtpIdType.FIREBASE,
        txtType: OtpTxtType.VERIFY,
      };
      const response: IOtpResponse = await apiPost<IOtpResponse>(
        '/otp',
        {data: body},
        {
          'Content-Type': 'application/json',
        },
      );
      setOtp(response.otpId);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setOtp('');
    setMinutes(1);
    setSeconds(30);
    setLoading(true);
    getOtp();
  };

  const handleContinue = async () => {
    if (isValidData()) {
      const body = {otpId: otp, otpValue: otpValue};
      try {
        const response: IVerifyOtpResponse = await apiPost<IVerifyOtpResponse>(
          '/otp/verify',
          {data: body},
          {
            'Content-Type': 'application/json',
          },
        );
        navigation.replace('Mail', {
          phoneNumber: phoneNumber,
          otpKey: response.otpKey,
        });
      } catch (error: any) {
        showError(error.message);
      }
    }
  };

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <View style={{height: 24}}>
        <HeaderBar
          firstChilden={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x6}
                color={theme.text01}
              />
            </TouchableOpacity>
          }
        />
      </View>
      <KeyboardAvoidingView
        style={[styles(theme).container, space(IconSizes.x10).mt]}>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.SubHeading,
              color: theme.text01,
            },
          ]}>
          OTP sent
        </Text>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Enter the code sent to your phone
        </Text>
        <View style={[styles(theme).inputContainer]}>
          <TextInput
            onChangeText={handleOnChangeText}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              },
            ]}
            autoFocus
            textAlign="center"
            placeholder="Code"
            placeholderTextColor={theme.text02}
          />
        </View>
        <Text
          style={[
            {
              ...FontWeights.Regular,
              ...FontSizes.Caption,
              color: theme.text01,
            },
          ]}>
          Didn't receive the code?{' '}
          {seconds > 0 || minutes > 0 ? (
            <Text
              style={[
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Caption,
                  color: theme.text01,
                },
              ]}>
              Resend in: {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Caption,
                    color: theme.text01,
                  },
                ]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </Text>
        <View
          style={[
            {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'},
            space(IconSizes.x5).mt,
          ]}>
          <PressableOpacity
            onPress={handleContinue}
            style={[
              styles(theme).button,
              styles(theme).buttonPrimary,
              {width: 150},
            ]}
            disabled={!isContinue || loading}
            disabledOpacity={0.4}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
            ) : (
              <>
                {isContinue && (
                  <Text
                    style={[
                      styles(theme).centerText,
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                      },
                    ]}>
                    Next step
                  </Text>
                )}
                <Ionicons
                  name="arrow-forward-outline"
                  size={IconSizes.x6}
                  color={theme.text01}
                />
              </>
            )}
          </PressableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Otp;

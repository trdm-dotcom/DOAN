import React, {useContext, useEffect, useState} from 'react';

import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
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
import {AppContext} from '../context';
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Header from '../components/header/Header';
import IconButton from '../components/control/IconButton';
import {ThemeStatic} from '../theme/Colors';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const Otp = ({navigation, route}: props) => {
  const {theme, fcmToken} = useContext(AppContext);
  const {mail, name, phoneNumber, otpId, nextStep} = route.params;
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
        id: phoneNumber ? phoneNumber : mail ? mail : fcmToken,
        idType: phoneNumber
          ? OtpIdType.SMS
          : mail
          ? OtpIdType.EMAIL
          : OtpIdType.FIREBASE,
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

  const resendOtp = async () => {
    setOtpValue('');
    setOtp('');
    setMinutes(1);
    setSeconds(30);
    await getOtp();
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
        navigation.replace(nextStep, {
          username: mail,
          mail: mail,
          name: name,
          phoneNumber: phoneNumber,
          otpKey: response.otpKey,
        });
      } catch (error: any) {
        showError(error.message);
      }
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
          <IconButton
            Icon={() => (
              <Ionicons
                name="chevron-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            )}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        keyboardVerticalOffset={20}
        style={[{flex: 1}, space(IconSizes.x10).mt]}>
        <Header title="OTP sent" />
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
            keyboardType="numeric"
            placeholder="Code"
            placeholderTextColor={theme.text02}
          />
        </View>
        <View style={styles(theme).row}>
          <Text
            style={[
              {
                ...FontWeights.Regular,
                ...FontSizes.Caption,
                color: theme.text01,
              },
              space(IconSizes.x00).mr,
            ]}>
            Didn't receive the code?{' '}
          </Text>
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
            <TouchableOpacity onPress={resendOtp} style={styles(theme).button}>
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
        </View>
        <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[styles(theme).button, styles(theme).buttonPrimary]}
            disabled={!isContinue || loading}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
            ) : (
              <>
                <Text
                  style={[
                    styles(theme).centerText,
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: ThemeStatic.white,
                    },
                  ]}>
                  Next step
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={IconSizes.x6}
                  color={ThemeStatic.white}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Otp;

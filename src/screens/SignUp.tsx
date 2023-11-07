import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import Typography from '../theme/Typography';
import {useContext, useState} from 'react';
import {AppContext} from '../context';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import {checkExist} from '../reducers/action/authentications';
import {OtpIdType} from '../models/enum/OtpIdType';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import IOtpResponse from '../models/response/IOtpResponse';
import {apiPost} from '../utils/Api';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {space, styles} from '../components/style';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Header from '../components/header/Header';
import {ThemeStatic} from '../theme/Colors';
import Animated, {FadeInDown} from 'react-native-reanimated';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [mail, setMail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isValidData = () => {
    const error =
      checkEmpty(mail, 'Please enter your email address') ||
      checkEmpty(name, 'Please enter your name');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnNameChangeText = (text: string) => {
    setName(text.trim());
  };

  const handleOnMailChangeText = (text: string) => {
    setMail(text.trim());
  };

  const handleOnChangePhoneNumber = (text: string) => {
    setPhoneNumber(text.trim());
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        const [responseCheckExistMail, responseCheckExistPhone] =
          await Promise.all([
            checkExist({
              value: mail,
            }),
            checkExist({
              value: phoneNumber,
            }),
          ]);
        if (
          !responseCheckExistMail.isExist &&
          !responseCheckExistPhone.isExist
        ) {
          const bodyGetOtp = {
            id: mail,
            idType: OtpIdType.EMAIL,
            txtType: OtpTxtType.VERIFY,
          };
          const responseGetOtp: IOtpResponse = await apiPost<IOtpResponse>(
            '/otp',
            {data: bodyGetOtp},
            {
              'Content-Type': 'application/json',
            },
          );
          navigation.navigate('Otp', {
            mail: mail,
            name: name,
            phoneNumber: phoneNumber,
            otpId: responseGetOtp.otpId,
            nextStep: 'Password',
          });
        } else {
          showError('This phone number or email address is already in use');
        }
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            Icon={() => (
              <Ionicons
                name="arrow-back-outline"
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
        style={{flex: 1}}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={20}>
        <Header title="Create your account" />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Enter your phone number
        </Text>
        <Animated.View
          style={[{flex: 1}, space(IconSizes.x5).mt]}
          entering={FadeInDown.delay(200).duration(1000).springify()}>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="person-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              onChangeText={handleOnNameChangeText}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              autoFocus
              placeholder="Full Name"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="mail-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              onChangeText={handleOnMailChangeText}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              keyboardType="email-address"
              placeholder="Email Address"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="call-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              onChangeText={handleOnChangePhoneNumber}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              keyboardType="numeric"
              placeholder="Phone Number"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleContinue}
              style={[styles(theme).button, styles(theme).buttonPrimary]}
              disabled={loading}>
              {loading ? (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={ThemeStatic.white}
                />
              ) : (
                <>
                  <Text
                    style={[
                      {
                        ...FontWeights.Bold,
                        ...FontSizes.Body,
                        color: ThemeStatic.white,
                      },
                      styles(theme).centerText,
                    ]}>
                    Next
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
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

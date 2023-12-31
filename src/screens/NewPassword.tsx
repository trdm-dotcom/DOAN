import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import Typography from '../theme/Typography';
import {AppContext} from '../context';
import {useContext, useState} from 'react';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {space, styles} from '../components/style';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, PASSWORD_REGEX} from '../constants/Constants';
import Header from '../components/header/Header';
import CheckBox from 'react-native-check-box';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {checkEmpty, checkRegex} from '../utils/Validate';
import {showError} from '../utils/Toast';
import IChangePasswordRequest from '../models/request/IChangePasswordRequest';
import {getHash} from '../utils/Crypto';
import {apiPost} from '../utils/Api';
import {ThemeStatic} from '../theme/Colors';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;
const NewPassword = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {mail, otpKey} = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [validError, setValidError] = useState<any>({});

  const isValidData = () => {
    let errors = {};
    const validPassword =
      checkEmpty(password, 'Password is required.') ||
      checkRegex(password, 'Password is invalid.', PASSWORD_REGEX);
    if (validPassword) {
      errors['password'] = validPassword;
    }
    const validComparePassword =
      password !== confirmPassword
        ? 'Password and confirm password do not match'
        : null;
    if (validComparePassword) {
      errors['confirmPassword'] = validComparePassword;
    }
    setValidError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (isValidData()) {
      setLoading(true);
      const body: IChangePasswordRequest = {
        username: mail,
        otpKey: otpKey,
        newPassword: password,
        hash: getHash('PASSWORD'),
      };
      console.log(body);
      apiPost<any>(
        '/user/resetPassword',
        {data: body},
        {
          'Content-Type': 'application/json',
        },
      )
        .then(() => {
          navigation.navigate('SignIn');
        })
        .catch(error => {
          showError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
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
        <Header title="Pick a new Password" />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Help secure your account
        </Text>
        <View style={[styles(theme).inputContainer, styles(theme).row]}>
          <TextInput
            onChangeText={(text: string) => {
              setPassword(text.trim());
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Regular,
                ...FontSizes.Body,
                color: theme.text01,
                flex: 1,
              },
            ]}
            autoFocus
            secureTextEntry={!isPasswordVisible}
            placeholder="Password"
            placeholderTextColor={theme.text02}
          />
        </View>
        <View style={[styles(theme).inputContainer, styles(theme).row]}>
          <TextInput
            onChangeText={(text: string) => {
              setConfirmPassword(text.trim());
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Regular,
                ...FontSizes.Body,
                color: theme.text01,
                flex: 1,
              },
            ]}
            secureTextEntry={!isPasswordVisible}
            placeholder="Confirm Password"
            placeholderTextColor={theme.text02}
          />
        </View>
        <View style={[{alignItems: 'flex-end'}, space(IconSizes.x5).mv]}>
          <CheckBox
            style={{flex: 1}}
            onClick={() => {
              setPasswordVisible(!isPasswordVisible);
            }}
            isChecked={isPasswordVisible}
            leftText={'Show'}
            leftTextStyle={{
              ...FontWeights.Regular,
              ...FontSizes.Body,
              color: theme.text01,
              marginRight: 10,
            }}
            checkBoxColor={theme.text02}
            checkedCheckBoxColor={ThemeStatic.accent}
          />
        </View>
        <Text
          style={[
            {
              ...FontWeights.Light,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Your password must be at least 8 characters, at least one number and
          both lower and uppercase letters and special characters
        </Text>
        <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[styles(theme).button, styles(theme).buttonPrimary]}
            disabled={loading}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
            ) : (
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.white,
                  },
                ]}>
                Done
              </Text>
            )}
          </TouchableOpacity>
          {Object.values(validError).map((errMessage: any, index: number) => (
            <Text
              key={index}
              style={{
                ...FontWeights.Regular,
                ...FontSizes.Caption,
                color: 'red',
              }}>
              {errMessage}
            </Text>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;

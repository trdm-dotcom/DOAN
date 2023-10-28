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
import {IconSizes} from '../constants/Constants';
import Header from '../components/header/Header';
import CheckBox from 'react-native-check-box';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import IChangePasswordRequest from '../models/request/IChangePasswordRequest';
import {getHash} from '../utils/Crypto';
import {apiPost} from '../utils/Api';
import {ThemeStatic} from '../theme/Colors';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;
const NewPassword = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {username, otpKey} = route.params;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidData = () => {
    const error =
      checkEmpty(password, 'Please enter your password') ||
      checkEmpty(confirmPassword, 'Please enter your confirm password') ||
      (password !== confirmPassword
        ? 'Password and confirm password do not match'
        : null);
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        const body: IChangePasswordRequest = {
          username: username,
          otpKey: otpKey,
          newPassword: password,
          hash: getHash('PASSWORD'),
        };
        await apiPost<any>('/user/resetPassword', body);
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
              const verify: boolean = text.trim().length > 0;
              setIsContinue(verify);
              if (verify) {
                setPassword(text.trim());
              }
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
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
              const verify: boolean = text.trim().length > 0;
              setIsContinue(verify);
              if (verify) {
                setConfirmPassword(text.trim());
              }
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
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
        <View style={{alignItems: 'flex-end'}}>
          <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={() => {
              setPasswordVisible(!isPasswordVisible);
            }}
            isChecked={isPasswordVisible}
            leftText="Show"
            leftTextStyle={[
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              },
              space(IconSizes.x1).mr,
            ]}
          />
        </View>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Your password must be at least 8 characters
        </Text>
        <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[styles(theme).button, styles(theme).buttonPrimary]}
            disabled={!isContinue || loading}>
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewPassword;

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import React, {useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import Header from '../components/header/Header';
import Typography from '../theme/Typography';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {ICheckExistRequest} from '../models/request/ICheckExistRequest';
import {ICheckExistResponse} from '../models/response/ICheckExistResponse';
import {checkExist} from '../reducers/action/authentications';
import {OtpIdType} from '../models/enum/OtpIdType';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import IOtpResponse from '../models/response/IOtpResponse';
import {apiPost} from '../utils/Api';
import {ThemeStatic} from '../theme/Colors';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Reset'>;

const Reset = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnChangeText = (text: string) => {
    setId(text.trim());
  };

  const isValidData = () => {
    const error = checkEmpty(id, 'Please enter your email address');
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
        const body: ICheckExistRequest = {
          value: id,
        };
        const responseCheckExist: ICheckExistResponse = await checkExist(body);
        if (responseCheckExist.isExist) {
          const bodyGetOtp = {
            id: id,
            idType: OtpIdType.EMAIL,
            txtType: OtpTxtType.RESET_PASSWORD,
          };
          const responseGetOtp: IOtpResponse = await apiPost<IOtpResponse>(
            '/otp',
            {data: bodyGetOtp},
            {
              'Content-Type': 'application/json',
            },
          );
          navigation.navigate('Otp', {
            mail: id,
            otpId: responseGetOtp.otpId,
            nextStep: 'NewPassword',
          });
        } else {
          showError('Your account is not exist');
        }
      } catch (error: any) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

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
      <KeyboardAvoidingView style={[{flex: 1}, space(IconSizes.x10).mt]}>
        <Header title="Forgot Password" />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Let's help recover your account
        </Text>
        <View style={[styles(theme).inputContainer, space(IconSizes.x5).mt]}>
          <TextInput
            value={id}
            onChangeText={handleOnChangeText}
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
            autoFocus
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
              <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default Reset;

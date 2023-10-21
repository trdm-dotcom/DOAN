import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {space, styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBar from '../components/header/HeaderBar';
import {AppContext} from '../context';
import {ICheckExistRequest} from '../models/request/ICheckExistRequest';
import {ICheckExistResponse} from '../models/response/ICheckExistResponse';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import {checkExist} from '../reducers/action/authentications';
import IOtpResponse from '../models/response/IOtpResponse';
import {apiPost} from '../utils/Api';
import {OtpIdType} from '../models/enum/OtpIdType';
import {OtpTxtType} from '../models/enum/OtpTxtType';
import Header from '../components/header/Header';
import IconButton from '../components/control/IconButton';
import DeviceNumber from 'react-native-device-number';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'PhoneNumber'>;

const PhoneNumber = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    DeviceNumber.get().then(({mobileNumber}) => {
      setPhoneNumber(mobileNumber.replace('+84', '0'));
    });
  }, []);

  const isValidData = () => {
    const error = checkEmpty(phoneNumber, 'Please enter your phome number');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnChangePhoneNumber = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    setIsContinue(verify);
    if (verify) {
      setPhoneNumber(text.trim());
    }
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        const body: ICheckExistRequest = {
          value: phoneNumber,
        };
        const responseCheckExist: ICheckExistResponse = await checkExist(body);
        if (!responseCheckExist.isExist) {
          const bodyGetOtp = {
            id: phoneNumber,
            idType: OtpIdType.SMS,
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
            phoneNumber: phoneNumber,
            otpId: responseGetOtp.otpId,
            nextStep: 'Mail',
          });
        } else {
          showError('This phone number is already in use');
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
      <KeyboardAvoidingView style={[{flex: 1}, space(IconSizes.x10).mt]}>
        <Header title="Phone Number" />
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
        <View style={[styles(theme).inputContainer, space(IconSizes.x5).mt]}>
          <TextInput
            value={phoneNumber}
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
            autoFocus
            placeholderTextColor={theme.text02}
          />
        </View>
        <View
          style={[
            {flex: 1, justifyContent: 'flex-end'},
            space(IconSizes.x5).mt,
          ]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[styles(theme).button, styles(theme).buttonPrimary]}
            disabled={!isContinue || loading}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
            ) : (
              <>
                <Text
                  style={[
                    {
                      ...FontWeights.Bold,
                      ...FontSizes.Body,
                      color: theme.text01,
                    },
                    styles(theme).centerText,
                  ]}>
                  Next
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={IconSizes.x6}
                  color={theme.text01}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PhoneNumber;

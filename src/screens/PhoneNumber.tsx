import React, {useContext, useRef, useState} from 'react';
import {KeyboardAvoidingView, Text, TouchableOpacity, View} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
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

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'PhoneNumber'>;

const PhoneNumber = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidData = () => {
    const error = checkEmpty(phoneNumber, 'Please enter your phome number');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnChangeFormattedText = (text: string) => {
    setIsContinue(phoneInput.current?.isValidNumber(text) || false);
  };

  const handleOnChangePhoneNumber = (text: string) => {
    setPhoneNumber(text);
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
                size={IconSizes.x8}
                color={theme.text01}
              />
            </TouchableOpacity>
          }
        />
      </View>
      <KeyboardAvoidingView style={[{flex: 1}, space(IconSizes.x10).mt]}>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.SubHeading,
              color: theme.text01,
            },
          ]}>
          Phone
        </Text>
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
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="VN"
            layout="first"
            onChangeText={handleOnChangePhoneNumber}
            onChangeFormattedText={handleOnChangeFormattedText}
            textInputStyle={[
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              },
            ]}
            codeTextStyle={[
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              },
            ]}
            containerStyle={[styles(theme).phoneNumberView]}
            textContainerStyle={[
              styles(theme).inputField,
              {paddingVertical: 0},
            ]}
            autoFocus
          />
        </View>
        <View
          style={[
            {flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'},
            space(IconSizes.x5).mt,
          ]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleContinue}
            style={[
              styles(theme).button,
              styles(theme).buttonPrimary,
              {width: 150},
            ]}
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
                    },
                    styles(theme).centerText,
                  ]}>
                  Next
                </Text>
                <Ionicons
                  name="arrow-forward-outline"
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

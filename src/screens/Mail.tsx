import React, {useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {space, styles} from '../components/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {checkEmpty} from '../utils/Validate';
import {showError} from '../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBar from '../components/header/HeaderBar';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {AppContext} from '../context';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {ICheckExistResponse} from '../models/response/ICheckExistResponse';
import {ICheckExistRequest} from '../models/request/ICheckExistRequest';
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import {checkExist} from '../reducers/action/authentications';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Mail'>;

const Mail = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const {phoneNumber, otpKey} = route.params;
  const [mail, setMail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidData = () => {
    const error = checkEmpty(mail, 'Please enter your email');
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };

  const handleOnEmailChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    setIsContinue(verify);
    if (verify) {
      setMail(text.trim());
    }
  };

  const handleOnNameChangeText = (text: string) => {
    const verify: boolean = text.trim().length > 0;
    if (verify) {
      setName(text.trim());
    }
  };

  const handleContinue = async () => {
    if (isValidData()) {
      try {
        setLoading(true);
        const body: ICheckExistRequest = {
          value: mail,
        };
        const responseCheckExist: ICheckExistResponse = await checkExist(body);
        if (!responseCheckExist.isExist) {
          navigation.navigate('Password', {
            mail: mail,
            phoneNumber: phoneNumber,
            name: name,
            otpKey: otpKey,
          });
        } else {
          showError('This email is already in use');
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
          Personal Infomation
        </Text>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          Please fill the following
        </Text>
        <View style={[styles(theme).inputContainer]}>
          <TextInput
            onChangeText={handleOnNameChangeText}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
              },
            ]}
            autoFocus
            placeholder="Full name"
            placeholderTextColor={theme.text02}
          />
        </View>
        <View style={[styles(theme).inputContainer]}>
          <TextInput
            onChangeText={handleOnEmailChangeText}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
              },
            ]}
            placeholder="Email Address"
            placeholderTextColor={theme.text02}
          />
        </View>
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
                    Next
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

export default Mail;

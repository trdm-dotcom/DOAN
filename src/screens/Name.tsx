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
import {IconSizes} from '../constants/Constants';
import Typography from '../theme/Typography';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {useAppDispatch, useAppSelector} from '../reducers/redux/store';
import {getAccountInfo} from '../reducers/redux/authentication.reducer';
import {IUpdateUserInfoRequest} from '../models/request/IUpdateUserInfoRequest';
import {updateUserInfo} from '../reducers/action/authentications';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Name'>;

const Name = ({navigation}: props) => {
  const dispatch = useAppDispatch();
  const {theme} = useContext(AppContext);
  const [name, setName] = useState<string>('');
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const userInfo: IUserInfoResponse = useAppSelector(
    state => state.auth.userInfo,
  );

  const isValidData = () => {
    const error = checkEmpty(name, 'Please enter your name');
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
      setName(text.trim());
    }
  };

  const handleContinue = () => {
    if (isValidData()) {
      userInfo.name = name;
      try {
        const body: IUpdateUserInfoRequest = {
          name: name,
          birthDay: userInfo.birthDay,
          avatar: userInfo.avatar,
        };
        updateUserInfo(body);
        dispatch(getAccountInfo(userInfo));
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
          Name
        </Text>
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Caption,
              color: theme.text02,
            },
          ]}>
          What's your name?
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
            placeholder="Your name"
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
            <Ionicons
              name="arrow-forward-outline"
              size={IconSizes.x6}
              color={theme.text01}
            />
          </PressableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Name;

import {AppContext} from '../context';
import {space, styles} from '../components/style';
import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Switch} from 'react-native';
import {ThemeVariant} from '../theme/Colors';
import {signOut} from '../reducers/action/authentications';
import {logout} from '../reducers/redux/authentication.reducer';
import {useAppDispatch, useAppSelector} from '../reducers/redux/store';
import {IconSizes} from '../constants/Constants';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppOption from '../components/shared/AppOption';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../theme/Typography';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import {NativeImage} from '../components/shared/NativeImage';
import AppButton from '../components/control/AppButton';
import {Modalize} from 'react-native-modalize';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import {showError} from '../utils/Toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Setting'>;

const Setting = ({navigation}: props) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const {theme, themeType, toggleTheme} = useContext(AppContext);
  const dispatch = useAppDispatch();
  const [isDarkMode, setIsDarkMode] = useState(themeType === ThemeVariant.dark);
  const [signoutConfirmationModal, setSignoutConfirmationModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const modalizeRef = React.useRef<Modalize>(null);

  const modalizeOpen = () => modalizeRef.current?.open();

  const handleSwitch = () => {
    if (isDarkMode) {
      toggleTheme(ThemeVariant.dark);
    } else {
      toggleTheme(ThemeVariant.light);
    }
    setIsDarkMode(previousState => !previousState);
  };

  const logOut = async () => {
    try {
      await signOut();
    } finally {
      dispatch(logout());
    }
  };

  const signoutConfirmationToggle = () => {
    setSignoutConfirmationModal(previousState => !previousState);
  };

  const handleOnPress = () => {
    try {
      setLoading(true);
      modalizeRef.current?.close();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
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
      <View
        style={[
          {alignItems: 'center'},
          space(IconSizes.x10).mt,
          space(IconSizes.x5).mb,
        ]}>
        <NativeImage uri={userInfo.avatar} style={styles(theme).avatar} />
        <View
          style={[styles(theme).profileNameContainer, space(IconSizes.x1).mv]}>
          <Text style={styles(theme).profileUsernameText}>{userInfo.name}</Text>
        </View>
        <AppButton
          label="Edit Info"
          onPress={() => modalizeOpen()}
          labelStyle={{
            ...FontWeights.Bold,
            ...FontSizes.Body,
            color: theme.text01,
          }}
          containerStyle={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              paddingHorizontal: IconSizes.x5,
              height: IconSizes.x9,
              borderRadius: 50,
            },
          ]}
        />
      </View>
      <View style={[styles(theme).row]}>
        <Ionicons
          name="settings-outline"
          size={IconSizes.x6}
          color={theme.text01}
        />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Label,
              color: theme.text01,
            },
            space(IconSizes.x1).ml,
          ]}>
          Setting
        </Text>
      </View>
      <View style={[styles().groupOptionContainer, space(IconSizes.x5).mv]}>
        <AppOption
          label="Dark Mode"
          iconName="moon-outline"
          children={
            <Switch
              value={isDarkMode}
              onValueChange={handleSwitch}
              thumbColor={isDarkMode ? theme.accent : theme.base}
              ios_backgroundColor={theme.base}
              trackColor={{
                false: theme.base,
                true: theme.accent,
              }}
            />
          }
          style={space(IconSizes.x00).mb}
        />
        <TouchableOpacity>
          <AppOption
            label="Notification"
            iconName="notifications-outline"
            children={
              <Ionicons
                name="chevron-forward"
                color={theme.base}
                size={IconSizes.x6}
              />
            }
          />
        </TouchableOpacity>
      </View>
      <View style={[styles(theme).row]}>
        <Ionicons
          name="hand-left-outline"
          size={IconSizes.x6}
          color={theme.text01}
        />
        <Text
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Label,
              color: theme.text01,
            },
            space(IconSizes.x1).ml,
          ]}>
          Danger Zone
        </Text>
      </View>
      <View style={[styles().groupOptionContainer, space(IconSizes.x5).mv]}>
        <TouchableOpacity onPress={() => signoutConfirmationToggle()}>
          <AppOption
            label="Sign out"
            iconName="log-out-outline"
            color="red"
            children={
              <Ionicons
                name="chevron-forward"
                color={theme.base}
                size={IconSizes.x6}
              />
            }
            style={space(IconSizes.x00).mb}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <AppOption
            label="Delete Account"
            iconName="sad-outline"
            color="red"
            children={
              <Ionicons
                name="chevron-forward"
                color={theme.base}
                size={IconSizes.x6}
              />
            }
          />
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        label="Sign Out"
        title="Are you sure you want to sign out?"
        color="red"
        isVisible={signoutConfirmationModal}
        toggle={signoutConfirmationToggle}
        onConfirm={logOut}
      />
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <View style={[{flex: 1, justifyContent: 'center'}]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleOnPress}
            style={[
              styles(theme).button,
              styles(theme).buttonPrimary,
              {flex: 1},
            ]}
            disabled={loading}>
            {loading ? (
              <LoadingIndicator size={IconSizes.x1} color={theme.text01} />
            ) : (
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: theme.text01,
                  },
                ]}>
                Done
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Modalize>
    </GestureHandlerRootView>
  );
};

export default Setting;

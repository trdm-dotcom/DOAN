/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import BottomSheetHeader from './BottomSheetHeader';
import {ThemeColors} from '../../constants/Types';
import AppOption from '../shared/AppOption';
import {ThemeVariant} from '../../theme/Colors';
import {signOut} from '../../reducers/action/authentications';
import {useAppDispatch} from '../../reducers/redux/store';
import {useAppNavigation} from '../../navigators/AppReactNavigation';

const {FontWeights, FontSizes} = Typography;

interface SettingsBottomSheetProps {
  ref: React.Ref<any>;
  onBlockListPress: () => void;
  onAboutPress: () => void;
}

const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> =
  React.forwardRef(({onBlockListPress, onAboutPress}, ref) => {
    const dispatch = useAppDispatch();
    const {toggleTheme, theme, themeType} = useContext(AppContext);
    const [isActive, setIsActive] = useState(false);
    const navigation = useAppNavigation();

    useEffect(() => {
      setIsActive(themeType === ThemeVariant.dark);
    }, []);

    const handleSwitch = () => {
      if (isActive) {
        toggleTheme(ThemeVariant.dark);
      } else {
        toggleTheme(ThemeVariant.light);
      }
      setIsActive(previousState => !previousState);
    };

    const logOut = async () => {
      dispatch(signOut());
      navigation.navigate('Start');
    };

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader heading="Settings" subHeading="Themes and options" />
        <View style={styles().content}>
          <AppOption
            label="Blocked users"
            iconName="ios-list"
            onPress={onBlockListPress}
          />
          <AppOption iconName="ios-color-palette">
            <Switch
              value={isActive}
              onValueChange={handleSwitch}
              thumbColor={isActive ? theme.accent : theme.placeholder}
            />
          </AppOption>
          <AppOption
            label="About"
            iconName="ios-information-circle-outline"
            onPress={onAboutPress}
          />
          <AppOption
            label="About"
            iconName="ios-information-circle-outline"
            onPress={onAboutPress}
          />
          <AppOption label="Logout" iconName="ios-log-out" onPress={logOut} />
        </View>
      </Modalize>
    );
  });

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingTop: 20,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
  });

export default SettingsBottomSheet;

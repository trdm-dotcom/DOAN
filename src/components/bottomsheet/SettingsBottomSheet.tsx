import React, {forwardRef, useContext} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {ThemeColors} from '../../constants/Types';
import AppOption from '../shared/AppOption';
import {ThemeVariant} from '../../theme/Colors';
import {signOut} from '../../reducers/action/authentications';
import {useAppDispatch} from '../../reducers/redux/store';
import {logout} from '../../reducers/redux/authentication.reducer';

const {FontWeights, FontSizes} = Typography;

interface SettingsBottomSheetProps {
  onBlockListPress: () => void;
  onAboutPress: () => void;
}

const SettingsBottomSheet = forwardRef<Modalize, SettingsBottomSheetProps>(
  ({onBlockListPress, onAboutPress}, ref) => {
    const dispatch = useAppDispatch();
    const {toggleTheme, theme, themeType} = useContext(AppContext);

    const handleSwitch = () => {
      if (themeType === ThemeVariant.dark) {
        toggleTheme(ThemeVariant.dark);
      } else {
        toggleTheme(ThemeVariant.light);
      }
    };

    const logOut = async () => {
      try {
        await signOut();
      } finally {
        dispatch(logout());
      }
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
            iconName="list-outline"
            onPress={onBlockListPress}
          />
          <AppOption iconName="color-palette-outline">
            <Switch
              value={themeType === ThemeVariant.dark}
              onValueChange={handleSwitch}
              thumbColor={
                themeType === ThemeVariant.dark
                  ? theme.accent
                  : theme.placeholder
              }
            />
          </AppOption>
          <AppOption
            label="About"
            iconName="information-circle-outline"
            onPress={onAboutPress}
          />
          <AppOption
            label="Logout"
            iconName="log-out-outline"
            onPress={logOut}
          />
        </View>
      </Modalize>
    );
  },
);

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

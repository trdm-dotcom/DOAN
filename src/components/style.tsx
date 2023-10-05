import {StyleSheet} from 'react-native';
import {
  CONTENT_SPACING,
  SAFE_AREA_PADDING,
  SCREEN_WIDTH,
} from '../constants/Constants';
import {ThemeColors} from '../constants/Types';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';

export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingHorizontal: SAFE_AREA_PADDING.paddingHorizontal,
      paddingVertical: SAFE_AREA_PADDING.paddingVertical,
    },
    defaultBackground: {
      backgroundColor: theme.base,
    },
    container: {
      flex: 1,
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    flashMessageTitle: {
      ...Typography.FontWeights.Light,
      ...Typography.FontSizes.Body,
      color: ThemeStatic.white,
    },
    fullWidth: {
      width: '100%',
    },
    mt20: {
      marginTop: 20,
    },
    mt40: {
      marginTop: 40,
    },
    ml10: {
      marginLeft: 10,
    },
    centerText: {
      textAlign: 'center',
    },
    displayTop: {
      position: 'absolute',
      top: SAFE_AREA_PADDING.paddingTop,
    },
    displayBottom: {
      position: 'absolute',
      bottom: SAFE_AREA_PADDING.paddingBottom,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7,
    },
    buttonPrimary: {
      backgroundColor: theme.accent,
      padding: CONTENT_SPACING,
    },
    buttonSecondary: {
      flexDirection: 'row',
      borderRadius: 7,
      padding: CONTENT_SPACING,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camButton: {
      height: 80,
      width: 80,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
      alignSelf: 'center',
      borderWidth: 4,
      borderColor: theme.accent,
    },
    inputContainer: {
      borderRadius: 7,
      marginVertical: CONTENT_SPACING,
      backgroundColor: theme.placeholder,
    },
    inputField: {
      backgroundColor: 'transparent',
      color: theme.text01,
      paddingVertical: 10,
      paddingHorizontal: CONTENT_SPACING,
    },
    phoneNumberView: {
      backgroundColor: 'transparent',
    },
    cameraContainer: {
      height: SCREEN_WIDTH - CONTENT_SPACING,
      borderRadius: 27,
      backgroundColor: theme.placeholder,
    },
    rightButtonRow: {
      position: 'absolute',
      right: SAFE_AREA_PADDING.paddingRight,
      top: SAFE_AREA_PADDING.paddingTop,
    },
    buttonCameraOption: {
      marginBottom: CONTENT_SPACING,
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
      backgroundColor: theme.placeholder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    searchContainer: {
      height: 50,
      flexDirection: 'row',
      marginVertical: CONTENT_SPACING,
      borderRadius: 7,
      backgroundColor: theme.placeholder,
    },
    search: {
      flexDirection: 'row',
    },
    cancelSearch: {
      position: 'absolute',
      textAlign: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    searchInput: {
      color: theme.text01,
      paddingVertical: 10,
    },
    tinyAvatar: {
      width: 40,
      height: 40,
      borderRadius: 25,
    },
    friendListItem: {
      margin: 10,
      padding: 10,
      backgroundColor: 'transparent',
      width: '80%',
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'row',
    },
  });

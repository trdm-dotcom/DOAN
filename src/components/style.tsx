import {Platform, StyleSheet} from 'react-native';
import {
  CONTENT_SPACING,
  PostDimensions,
  SAFE_AREA_PADDING,
  SCREEN_WIDTH,
} from '../constants/Constants';
import {ThemeColors} from '../constants/Types';
import Typography from '../theme/Typography';
import {ThemeStatic} from '../theme/Colors';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const {FontWeights, FontSizes} = Typography;

export const space = (spacing = CONTENT_SPACING) =>
  StyleSheet.create({
    mt: {
      marginTop: spacing,
    },
    mb: {
      marginBottom: spacing,
    },
    ml: {
      marginLeft: spacing,
    },
    mr: {
      marginRight: spacing,
    },
    mv: {
      marginVertical: spacing,
    },
    mh: {
      marginHorizontal: spacing,
    },
    m: {
      margin: spacing,
    },
    pt: {
      paddingTop: spacing,
    },
    pb: {
      paddingBottom: spacing,
    },
    pl: {
      paddingLeft: spacing,
    },
    pr: {
      paddingRight: spacing,
    },
    p: {
      padding: spacing,
    },
    pv: {
      paddingVertical: spacing,
    },
    ph: {
      paddingHorizontal: spacing,
    },
  });

export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    defaultBackground: {
      backgroundColor: theme.base,
    },
    container: {
      flex: 1,
      paddingHorizontal: SAFE_AREA_PADDING.paddingHorizontal,
      paddingVertical: SAFE_AREA_PADDING.paddingVertical,
    },
    flashMessageTitle: {
      ...Typography.FontWeights.Light,
      ...Typography.FontSizes.Body,
      color: ThemeStatic.white,
    },
    fullWidth: {
      width: '100%',
    },
    centerText: {
      textAlign: 'center',
    },
    displayBottom: {
      position: 'absolute',
      bottom: SAFE_AREA_PADDING.paddingBottom,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    buttonPrimary: {
      backgroundColor: theme.accent,
      padding: CONTENT_SPACING,
    },
    buttonSecondary: {
      flexDirection: 'row',
      borderRadius: 10,
      padding: CONTENT_SPACING,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // form field
    inputContainer: {
      borderRadius: 10,
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
    inputSearchcontainer: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      width: '90%',
      alignSelf: 'center',
      paddingVertical: Platform.select({ios: 10, android: 5}),
      paddingHorizontal: 20,
      backgroundColor: theme.placeholder,
      color: theme.text01,
      borderRadius: 10,
      marginVertical: 5,
    },

    // camera screen
    cameraContainer: {
      height: SCREEN_WIDTH,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
      overflow: 'hidden',
    },
    buttonCameraOption: {
      marginBottom: CONTENT_SPACING,
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButton: {
      height: 80,
      width: 80,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
      alignSelf: 'center',
      borderWidth: 4,
      borderColor: theme.accent,
    },
    captureButtonContainer: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: SAFE_AREA_PADDING.paddingBottom,
    },

    // friend list
    tinyAvatar: {
      height: 50,
      width: 50,
      borderRadius: 50,
      backgroundColor: theme.placeholder,
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

    // modalize
    modalizeContainer: {
      marginTop: 40,
      flex: 1,
      backgroundColor: theme.base,
      paddingHorizontal: SAFE_AREA_PADDING.paddingHorizontal,
      paddingVertical: SAFE_AREA_PADDING.paddingVertical,
    },
    modalizeContent: {
      flex: 1,
      paddingBottom: responsiveHeight(5),
    },
    listContainer: {
      flex: 1,
    },
    listItemContainer: {
      width: '100%',
    },
    listContentContainer: {
      // alignItems: 'center',
      justifyContent: 'flex-start',
    },

    // user card
    userCardContainer: {
      flexDirection: 'row',
      borderRadius: 10,
      justifyContent: 'space-between',
    },
    handleText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
    nameText: {
      ...FontWeights.Bold,
      ...FontSizes.Body,
      color: theme.text01,
      alignItems: 'center',
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
    },
    // messages
    messagesList: {
      flex: 1,
      paddingHorizontal: 4,
    },

    //group options settings
    groupOptionContainer: {
      borderRadius: 20,
      overflow: 'hidden',
    },
    appOptions: {
      backgroundColor: theme.placeholder,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    labelOption: {
      ...FontWeights.Bold,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.text01,
    },
    avatarImage: {
      height: 110,
      width: 110,
      backgroundColor: theme.placeholder,
      borderRadius: 110,
    },
    profileNameContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileUsernameText: {
      ...FontWeights.Bold,
      ...FontSizes.SubHeading,
      color: theme.text01,
    },

    // post view
    postViewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postViewAvatarImage: {
      height: 50,
      width: 50,
      backgroundColor: theme.placeholder,
      borderRadius: 50,
      marginRight: 12,
    },
    postViewImage: {
      ...PostDimensions.Large,
      alignSelf: 'center',
      marginTop: 25,
      borderRadius: 40,
      backgroundColor: theme.placeholder,
    },
    postViewLikes: {
      flexDirection: 'row',
      marginTop: 20,
    },
    postViewLikesText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.text01,
    },
    postViewCaptionText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
      marginTop: 10,
      marginBottom: 20,
    },
  });

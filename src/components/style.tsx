import {StyleSheet} from 'react-native';
import {CONTENT_SPACING, SAFE_AREA_PADDING, SCREEN_WIDTH} from '../Constants';
export const colors = {
  primary: '#F5618B',
  secondary: '#928899',
  tertiary: '#1A1B1E',
  dark: '#242424',
  white: '#FFFFFF',
  black: '#000000',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: SAFE_AREA_PADDING.paddingHorizontal,
    marginVertical: SAFE_AREA_PADDING.paddingVertical,
  },
  defaultBackground: {
    backgroundColor: colors.black,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 24,
  },
  h3: {
    fontSize: 18,
  },
  h4: {
    fontSize: 16,
  },
  h5: {
    fontSize: 14,
  },
  h6: {
    fontSize: 12,
  },
  fullWidth: {
    width: '100%',
  },
  mt20: {
    marginTop: 20,
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
  normalText: {
    fontWeight: 'normal',
    color: colors.white,
  },
  boldText: {
    fontWeight: 'bold',
    color: colors.white,
  },
  italicText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.white,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: 7,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: colors.secondary,
  },
  buttonDark: {
    backgroundColor: colors.dark,
    borderRadius: 55,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    borderRadius: 7,
    marginVertical: 15,
    backgroundColor: colors.tertiary,
  },
  inputField: {
    backgroundColor: 'transparent',
    color: colors.white,
    paddingVertical: 10,
  },
  phoneNumberView: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  cameraContainer: {
    borderRadius: 50,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: colors.dark,
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
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  headerStyle: {
    position: 'absolute',
    backgroundColor: colors.black,
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
  },
});

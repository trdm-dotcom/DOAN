import {StyleSheet} from 'react-native';
const colors = {
  primary: '#FF565A',
  secondary: '#008488',
  tertiary: '#4B4B4B',
  dark: '#3F3F3F',
  white: '#FFFFFF',
  black: '#212225',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  defaultBackground: {
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center the TextInput vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
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
  topText: {
    position: 'absolute',
    top: 20, // Adjust this value as needed
  },
  centerText: {
    textAlign: 'center',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20, // Adjust this value as needed
  },
  fullWidthButton: {
    width: '100%',
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
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 25,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 15,
    borderRadius: 15,
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
});

export {styles, colors};

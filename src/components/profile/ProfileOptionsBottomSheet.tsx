import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {ThemeStatic} from '../../theme/Colors';
import {ThemeColors} from '../../constants/Types';
import Option from '../shared/Option';

interface ProfileOptionsBottomSheetProps {
  ref: React.Ref<any>;
  onBlockUser: () => void;
}

const ProfileOptionsBottomSheet: React.FC<ProfileOptionsBottomSheetProps> =
  React.forwardRef(({onBlockUser}, ref) => {
    const {theme} = useContext(AppContext);

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader
          heading="Options"
          subHeading="Tell us what you think"
        />
        <View style={styles().content}>
          <Option
            label="Block"
            iconName="ban-outline"
            color={ThemeStatic.delete}
            onPress={onBlockUser}
          />
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
      paddingBottom: 16,
    },
  });

export default ProfileOptionsBottomSheet;

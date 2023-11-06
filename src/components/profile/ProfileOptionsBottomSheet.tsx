import React, {useContext} from 'react';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {ThemeStatic} from '../../theme/Colors';
import Option from '../shared/Option';
import {styles} from '../style';

interface ProfileOptionsBottomSheetProps {
  ref: React.Ref<any>;
  onBlockUser: () => void;
}

const ProfileOptionsBottomSheet: React.FC<ProfileOptionsBottomSheetProps> =
  React.forwardRef(({onBlockUser}, ref) => {
    const {theme} = useContext(AppContext);

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).modalizeContainer}
        adjustToContentHeight>
        <BottomSheetHeader
          heading="Options"
          subHeading="Tell us what you think"
        />
        <Option
          label="Block"
          iconName="ban-outline"
          color={ThemeStatic.delete}
          onPress={onBlockUser}
        />
      </Modalize>
    );
  });

export default ProfileOptionsBottomSheet;

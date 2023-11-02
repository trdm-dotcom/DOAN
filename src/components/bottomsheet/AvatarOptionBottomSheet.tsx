import React, {forwardRef, useContext} from 'react';
import {AppContext} from '../../context';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Option from '../shared/Option';

interface AvatarOptionsBottomSheetProps {
  ref: React.Ref<any>;
  onOpenCamera: () => void;
  onOpenGallery: () => void;
}

const AvatarOptionsBottomSheet: React.FC<AvatarOptionsBottomSheetProps> =
  forwardRef(({onOpenCamera, onOpenGallery}, ref) => {
    const {theme} = useContext(AppContext);

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[
          {
            padding: 20,
            backgroundColor: theme.base,
          },
        ]}
        adjustToContentHeight>
        <View
          style={[
            {
              flex: 1,
              paddingTop: 20,
              paddingBottom: 16,
            },
          ]}>
          <Option
            label="Take a photo"
            iconName="camera-outline"
            color={theme.text01}
            onPress={onOpenCamera}
          />
          <Option
            label="Choose from gallery"
            iconName="images-outline"
            color={theme.text01}
            onPress={onOpenGallery}
          />
        </View>
      </Modalize>
    );
  });

export default AvatarOptionsBottomSheet;

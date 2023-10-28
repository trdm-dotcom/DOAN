import React, {Ref, forwardRef, useContext, useState} from 'react';
import {AppContext} from '../../context';
import {Modalize} from 'react-native-modalize';
import {space, styles} from '../style';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {IconSizes} from '../../constants/Constants';
import {NativeImage} from '../shared/NativeImage';
import Typography from '../../theme/Typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {updatePost} from '../../reducers/action/post';
import {getHash} from '../../utils/Crypto';
import {BallIndicator} from 'react-native-indicators';
import {ThemeStatic} from '../../theme/Colors';

const {FontWeights, FontSizes} = Typography;

interface EditPostBottomSheetProps {
  ref: Ref<any>;
  post: any;
}

const EditPostBottomSheet: React.FC<EditPostBottomSheetProps> = forwardRef(
  ({post}, ref) => {
    const {theme} = useContext(AppContext);

    const [caption, setCaption] = useState<any>(post.caption);
    const [loading, setLoading] = useState<boolean>(false);

    const doUpdatePost = () => {
      setLoading(true);
      const body = {
        post: post.id,
        hash: getHash('UPDATE_POST'),
        caption: caption,
      };
      updatePost(body).then(() => {
        setLoading(false);
        // @ts-ignore
        return ref.current.close();
      });
    };

    const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).modalizeContainer}
        adjustToContentHeight>
        <BottomSheetHeader heading="Edit Post" subHeading="Edit your post" />
        <View style={styles(theme).modalizeContent}>
          <KeyboardAvoidingView
            behavior={keyboardBehavior}
            keyboardVerticalOffset={20}
            style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}>
            <NativeImage uri={post.uri} style={StyleSheet.absoluteFill} />
            <TextInput
              value={caption}
              onChangeText={(text: string) => {
                setCaption(text);
              }}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                  flex: 1,
                },
              ]}
              autoFocus
              placeholder="Add a caption..."
              placeholderTextColor={theme.text02}
            />
          </KeyboardAvoidingView>
          <View
            style={[
              styles(theme).row,
              {
                justifyContent: 'space-around',
                alignItems: 'center',
              },
              space(IconSizes.x8).mv,
            ]}>
            <TouchableOpacity
              onPress={doUpdatePost}
              activeOpacity={0.9}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.placeholder,
                padding: IconSizes.x7,
                borderRadius: 50,
              }}
              disabled={loading}>
              {loading ? (
                <BallIndicator size={IconSizes.x9} color={ThemeStatic.white} />
              ) : (
                <Ionicons
                  name="paper-plane"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    );
  },
);

export default EditPostBottomSheet;

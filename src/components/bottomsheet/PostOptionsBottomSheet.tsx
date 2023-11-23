import React, {useContext} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import {ThemeStatic} from '../../theme/Colors';
import Option from '../shared/Option';
import {styles} from '../style';
import {useSelector} from 'react-redux';

interface PostOptionsBottomSheetProps {
  ref: React.Ref<any>;
  post: any;
  onPostEdit: () => void;
  onPostDelete: () => void;
  onPostDiable: () => void;
  onPostUnDiable: () => void;
}

const PostOptionsBottomSheet: React.FC<PostOptionsBottomSheetProps> =
  React.forwardRef(
    ({post, onPostEdit, onPostDelete, onPostDiable, onPostUnDiable}, ref) => {
      const {theme} = useContext(AppContext);
      const {user} = useSelector((state: any) => state.user);

      const isOwnPost = user.id === post.author!.id;

      const onPostUnfriend = () => {
        // @ts-ignore
        return ref.current.close();
      };

      const onPostBlock = () => {
        // @ts-ignore
        return ref.current.close();
      };

      let content = (
        <>
          <Option
            label="Unfriend"
            iconName="person-remove-outline"
            onPress={onPostUnfriend}
          />
          <Option label="Block" iconName="ban-outline" onPress={onPostBlock} />
        </>
      );

      if (isOwnPost) {
        content = (
          <>
            <Option
              label="Edit"
              iconName="create-outline"
              onPress={onPostEdit}
            />
            {post.disable ? (
              <Option
                label="Unhide"
                iconName="eye-outline"
                onPress={onPostUnDiable}
              />
            ) : (
              <Option
                label="Hide"
                iconName="eye-off-outline"
                onPress={onPostDiable}
              />
            )}
            <Option
              label="Delete"
              iconName="trash-outline"
              color={ThemeStatic.delete}
              onPress={onPostDelete}
            />
          </>
        );
      }

      return (
        <Modalize
          //@ts-ignore
          ref={ref}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
          modalStyle={[styles(theme).modalizeContainer]}
          adjustToContentHeight>
          <View
            style={[
              {
                flex: 1,
                paddingTop: 20,
                paddingBottom: 16,
              },
            ]}>
            {content}
          </View>
        </Modalize>
      );
    },
  );

export default PostOptionsBottomSheet;

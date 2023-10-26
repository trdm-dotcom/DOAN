import React, {useContext} from 'react';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {AppContext} from '../../context';
import {ThemeStatic} from '../../theme/Colors';
import Option from '../shared/Option';
import {useAppSelector} from '../../reducers/redux/store';

interface PostOptionsBottomSheetProps {
  ref: React.Ref<any>;
  post: any;
  onPostEdit: () => void;
  onPostDelete: () => void;
  onPostDiable: () => void;
}

const PostOptionsBottomSheet: React.FC<PostOptionsBottomSheetProps> =
  React.forwardRef(({post, onPostEdit, onPostDelete, onPostDiable}, ref) => {
    const {theme} = useContext(AppContext);
    const user = useAppSelector(state => state.auth.userInfo);

    const isOwnPost = user.id === post.author.userId;

    const onPostUnfriend = () => {
      // @ts-ignore
      ref.current.close();
    };

    const onPostBlock = () => {
      // @ts-ignore
      ref.current.close();
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
          <Option label="Edit" iconName="create-outline" onPress={onPostEdit} />
          <Option
            label="Hide"
            iconName="eye-off-outline"
            color={ThemeStatic.delete}
            onPress={onPostDiable}
          />
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
          {content}
        </View>
      </Modalize>
    );
  });

export default PostOptionsBottomSheet;

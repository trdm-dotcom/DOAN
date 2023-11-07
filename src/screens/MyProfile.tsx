import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from '../context';
import {space, styles} from '../components/style';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FETCHING_HEIGHT,
  IconSizes,
  Pagination,
  PostDimensions,
} from '../constants/Constants';
import HeaderBar from '../components/header/HeaderBar';
import ProfileScreenPlaceholder from '../components/placeholder/ProfileScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {getPostOfUser} from '../reducers/action/post';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getFriendList} from '../reducers/action/friend';
import ConnectionsBottomSheet from '../components/bottomsheet/ConnectionsBottomSheet';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import Typography from '../theme/Typography';
import {useNavigation} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {putUserInfo} from '../reducers/action/user';
import {showError} from '../utils/Toast';
import {useDispatch, useSelector} from 'react-redux';
import {ThemeStatic} from '../theme/Colors';
import {checkEmpty} from '../utils/Validate';
import {NativeImage} from '../components/shared/NativeImage';
import Option from '../components/shared/Option';
import {Image as ImageCompressor} from 'react-native-compressor';

const {FontWeights, FontSizes} = Typography;

const MyProfile = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [friends, setFriends] = useState<any[]>([]);
  const [offsetY, setOffsetY] = useState(0);
  const [name, setName] = useState<string>(user.name);
  const [about, setAbout] = useState<string>(user.about);
  const [avatar, setAvatar] = useState<any>(user.avatar);
  const [autoUploadImage, setAutoUploadImage] = useState<boolean>(false);
  const {isLoading, error: errorRedux} = useSelector(
    (state: any) => state.user,
  );

  const modalizeRef = useRef();
  const avatarOptionsBottomSheetRef = useRef();
  const friendsBottomSheetRef = useRef();

  const onFriendsOpen = () => {
    // @ts-ignore
    return friendsBottomSheetRef.current.open();
  };

  const modalizeOpen = () => {
    // @ts-ignore
    return modalizeRef.current.open();
  };

  const modalizeClose = () => {
    // @ts-ignore
    return modalizeRef.current.close();
  };

  const openOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return avatarOptionsBottomSheetRef.current.close();
  };

  useEffect(() => {
    if (errorRedux != null) {
      showError(errorRedux);
    }
  }, [errorRedux]);

  useEffect(() => {
    setLoading(true);
    getFriendList({
      pageNumber: 0,
      pageSize: Pagination.PAGE_SIZE,
    })
      .then(res => {
        setFriends(res);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts(pageNumber);
    return () => {};
  }, [pageNumber]);

  const onOpenCamera = (autoUpdate: boolean) => {
    closeOptions();
    ImagePicker.openCamera({
      compressImageQuality: 0.8,
      includeBase64: true,
      writeTempFile: false,
      useFrontCamera: true,
    })
      .then((image: Image) => {
        if (image.data != null) {
          ImageCompressor.compress(image.path, {
            maxWidth: 480,
            maxHeight: 480,
            input: 'uri',
            compressionMethod: 'auto',
            quality: 0.6,
            returnableOutputType: 'base64',
          }).then((compressedImage: string) => {
            if (autoUpdate) {
              setAvatar(`data:${image.mime};base64,${compressedImage}`);
              editInfo(
                name,
                `data:${image.mime};base64,${compressedImage}`,
                about,
              );
            } else {
              setAvatar(`data:${image.mime};base64,${compressedImage}`);
              modalizeOpen();
            }
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const onOpenGallery = (autoUpdate: boolean) => {
    closeOptions();
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        if (image.data != null) {
          ImageCompressor.compress(image.path, {
            maxWidth: 480,
            maxHeight: 480,
            input: 'uri',
            compressionMethod: 'auto',
            quality: 0.6,
            returnableOutputType: 'base64',
          }).then((compressedImage: string) => {
            if (autoUpdate) {
              setAvatar(`data:${image.mime};base64,${compressedImage}`);
              editInfo(
                name,
                `data:${image.mime};base64,${compressedImage}`,
                about,
              );
            } else {
              setAvatar(`data:${image.mime};base64,${compressedImage}`);
              modalizeOpen();
            }
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const editInfo = async (nameEdit: any, avatarEdit: any, aboutEdit: any) => {
    const errorValid = checkEmpty(name, 'Please enter your name');
    if (errorValid) {
      showError(errorValid);
      return;
    }
    try {
      dispatch({
        type: 'updateUserRequest',
      });
      await putUserInfo({
        name: nameEdit,
        avatar: avatarEdit,
        about: aboutEdit,
      });
      dispatch({
        type: 'updateUserSuccess',
        payload: {
          ...user,
          name: nameEdit,
          avatar: avatarEdit,
          about: aboutEdit,
        },
      });
      modalizeClose();
    } catch (err: any) {
      dispatch({
        type: 'updateUserFailed',
      });
    }
  };

  const handleOnPress = () => editInfo(name, avatar, about);

  const fetchPosts = (page: number) => {
    getPostOfUser({
      targetId: user.id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    }).then(res => {
      setSortedPosts(page === 0 ? res : [...sortedPosts, ...res]);
    });
  };

  const ListHeaderComponent = () => {
    return (
      <ProfileCard
        avatar={user.avatar}
        name={user.name}
        about={user.about}
        posts={sortedPosts.length}
        friends={friends.length}
        onFriendsOpen={onFriendsOpen}
        onOptionPress={modalizeOpen}
        editable
        onEdit={() => {
          openOptions();
          setAutoUploadImage(true);
        }}
      />
    );
  };

  function onScroll(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
  }

  function onScrollEndDrag(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
    if (y <= -FETCHING_HEIGHT && !loading) {
      setPageNumber(pageNumber + 1);
    }
  }

  function onRelease() {
    if (offsetY <= -FETCHING_HEIGHT && !loading) {
      setPageNumber(pageNumber + 1);
    }
  }

  const refreshControl = () => {
    const onRefresh = () => setPageNumber(0);

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    );
  };

  const renderItem = ({item}) => {
    return (
      <PostThumbnail
        id={item.id}
        uri={item.source}
        dimensions={PostDimensions.Medium}
      />
    );
  };

  const handleStateChange = (friend: any) => {
    setFriends(friends.filter(item => item.id !== friend.id));
  };

  let content =
    loading || error ? (
      <ProfileScreenPlaceholder viewMode />
    ) : (
      <>
        <FlatGrid
          refreshControl={refreshControl()}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
          ListEmptyComponent={() => (
            <ListEmptyComponent listType="posts" spacing={30} />
          )}
          ListFooterComponent={() => (
            <View
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                space(IconSizes.x1).mt,
              ]}>
              {loading && (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={theme.placeholder}
                />
              )}
            </View>
          )}
          style={[
            {
              flex: 1,
            },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEndDrag}
          onResponderRelease={onRelease}
          keyExtractor={item => item.id.toString()}
        />
        <ConnectionsBottomSheet
          ref={friendsBottomSheetRef}
          datas={friends}
          name={name}
          onStateChange={handleStateChange}
        />
      </>
    );

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        title="Profile"
        titleStyle={{
          ...FontWeights.Bold,
          ...FontSizes.Label,
          color: theme.text01,
        }}
        contentRight={
          <IconButton
            onPress={() => navigation.navigate('Setting')}
            Icon={() => (
              <Ionicons
                name="settings-outline"
                size={IconSizes.x6}
                color={theme.text01}
              />
            )}
          />
        }
      />
      {content}
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={[styles(theme).modalizeContainer]}
        adjustToContentHeight>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={20}>
          <BottomSheetHeader
            heading="Edit profile"
            subHeading="Edit your personal information"
          />
          <View style={[{alignItems: 'center'}, space(IconSizes.x5).mv]}>
            <View
              style={{
                height: 80,
                width: 80,
              }}>
              <NativeImage
                uri={avatar}
                style={{
                  flex: 1,
                  backgroundColor: theme.placeholder,
                  borderRadius: 80,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={isLoading}
                onPress={() => {
                  modalizeClose();
                  openOptions();
                  setAutoUploadImage(false);
                }}
                style={{
                  position: 'absolute',
                  bottom: -10,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 40,
                  width: 60,
                  height: 30,
                  borderWidth: 2,
                  borderColor: theme.base,
                  backgroundColor: theme.accent,
                }}>
                <Ionicons
                  name="add"
                  size={IconSizes.x4}
                  color={ThemeStatic.white}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="person-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              value={name}
              onChangeText={(text: string) => {
                setName(text);
              }}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              placeholder="Your name"
              placeholderTextColor={theme.text02}
            />
          </View>
          <View style={[styles(theme).inputContainer, styles(theme).row]}>
            <Ionicons
              name="person-outline"
              size={IconSizes.x6}
              color={theme.text02}
            />
            <TextInput
              value={about}
              onChangeText={(text: string) => {
                setAbout(text);
              }}
              style={[
                styles(theme).inputField,
                {
                  ...FontWeights.Regular,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              placeholder="About"
              placeholderTextColor={theme.text02}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleOnPress}
            disabled={isLoading}
            style={[styles(theme).button, styles(theme).buttonPrimary]}>
            {isLoading ? (
              <LoadingIndicator size={IconSizes.x1} color={ThemeStatic.white} />
            ) : (
              <Text
                style={[
                  styles(theme).centerText,
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.white,
                  },
                ]}>
                Done
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modalize>
      <Modalize
        ref={avatarOptionsBottomSheetRef}
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
          <Option
            label="Take a photo"
            iconName="camera-outline"
            color={theme.text01}
            onPress={() => onOpenCamera(autoUploadImage)}
          />
          <Option
            label="Choose from gallery"
            iconName="images-outline"
            color={theme.text01}
            onPress={() => onOpenGallery(autoUploadImage)}
          />
          <Option
            label="Delete"
            iconName="close-circle-outline"
            color="red"
            onPress={() => editInfo(name, null, about)}
          />
        </View>
      </Modalize>
    </GestureHandlerRootView>
  );
};

export default MyProfile;

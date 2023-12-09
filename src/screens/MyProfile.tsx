import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from '../context';
import {space, styles} from '../components/style';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FULLNAME_REGEX,
  IconSizes,
  Pagination,
  SCREEN_WIDTH,
} from '../constants/Constants';
import HeaderBar from '../components/header/HeaderBar';
import ProfileScreenPlaceholder from '../components/placeholder/ProfileScreen.Placeholder';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import ProfileCard from '../components/profile/ProfileCard';
import PostThumbnail from '../components/post/PostThumbnail';
import {
  getPostHiden,
  getPostOfUser,
  getPostTagged,
} from '../reducers/action/post';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {getFriendList} from '../reducers/action/friend';
import ConnectionsBottomSheet from '../components/bottomsheet/ConnectionsBottomSheet';
import {
  KeyboardAvoidingView,
  Platform,
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
import {checkEmpty, checkRegex} from '../utils/Validate';
import {NativeImage} from '../components/shared/NativeImage';
import Option from '../components/shared/Option';
import {Image as ImageCompressor} from 'react-native-compressor';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import Feather from 'react-native-vector-icons/Feather';
import {localApiPost} from '../utils/Api';

const {FontWeights, FontSizes} = Typography;

type Route = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const MyProfile = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {user, loading: userLoading} = useSelector((state: any) => state.user);
  const {myPost, myPostHide, myPostTag, totalMyPost} = useSelector(
    (state: any) => state.post,
  );
  const {friends, totalFriends} = useSelector((state: any) => state.friend);
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name);
  const [about, setAbout] = useState<string>(user.about);
  const [avatar, setAvatar] = useState<any>(user.avatar);
  const [avatarFilename, setAvatarFilename] = useState<any>(null);
  const [autoUploadImage, setAutoUploadImage] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(0);
  const [nextPageTagged, setNextPageTagged] = useState<number>(0);
  const [nextPageHiden, setNextPageHiden] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPagesTagged, setTotalPagesTagged] = useState<number>(0);
  const [totalPagesHiden, setTotalPagesHiden] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [validError, setValidError] = useState<any>({});

  const [routes] = useState<Route[]>([
    {key: 'post', icon: 'grid'},
    {key: 'tag', icon: 'tag'},
    {key: 'hide', icon: 'eye-off'},
  ]);

  const {isLoading, error: errorRedux} = useSelector(
    (state: any) => state.user,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (errorRedux) {
      showError(errorRedux);
      dispatch({type: 'clearErrors'});
    }
  }, [errorRedux]);

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

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetchPosts(0),
      fetchPostTags(0),
      fetchPostHiden(0),
      fetchFriends(0),
    ])
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFriends = async (page: number) => {
    try {
      dispatch({type: 'getFriendRequest'});
      const res = await getFriendList({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
      dispatch({type: 'getFriendSuccess', payload: res});
    } catch (err: any) {
      dispatch({type: 'getFriendFailed', payload: err.message});
    }
  };

  const requestImageModeration = async (imageData: string, filename: string) =>
    await localApiPost<any>('/moderation/image', {
      data: {imageData: imageData, filename: filename},
    });

  const requestTextModeration = async (text: string) =>
    await localApiPost<any>('/moderation/text', {
      data: {text: text, mode: 'ml'},
    });

  const onOpenCamera = async (autoUpdate: boolean) => {
    try {
      closeOptions();
      const image: Image = await ImagePicker.openCamera({
        width: 480,
        height: 480,
        cropping: true,
        compressImageQuality: 0.6,
        includeBase64: true,
        writeTempFile: false,
        useFrontCamera: true,
      });
      if (image.data != null) {
        const compressedImage = await ImageCompressor.compress(image.path, {
          maxWidth: 480,
          maxHeight: 480,
          input: 'uri',
          compressionMethod: 'auto',
          quality: 0.6,
          returnableOutputType: 'base64',
        });
        if (autoUpdate) {
          const res = await requestImageModeration(
            compressedImage,
            'image.jpg',
          );
          if (res.summary.action === 'reject') {
            showError('Content is not allowed');
            return;
          }
          await editInfo(
            name,
            `data:${image.mime};base64,${compressedImage}`,
            about,
            image.filename,
          );
        } else {
          setAvatar(`data:${image.mime};base64,${compressedImage}`);
          setAvatarFilename(image.filename);
          modalizeOpen();
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onOpenGallery = async (autoUpdate: boolean) => {
    try {
      closeOptions();
      const image: Image = await ImagePicker.openPicker({
        width: 480,
        height: 480,
        cropping: true,
        compressImageQuality: 0.6,
        includeBase64: true,
        writeTempFile: false,
      });
      if (image.data != null) {
        const compressedImage = await ImageCompressor.compress(image.path, {
          maxWidth: 480,
          maxHeight: 480,
          input: 'uri',
          compressionMethod: 'auto',
          quality: 0.6,
          returnableOutputType: 'base64',
        });
        if (autoUpdate) {
          const res = await requestImageModeration(
            compressedImage,
            'image.jpg',
          );
          if (res.summary.action === 'reject') {
            showError('Content is not allowed');
            return;
          }
          await editInfo(
            name,
            `data:${image.mime};base64,${compressedImage}`,
            about,
            image.filename,
          );
        } else {
          setAvatar(`data:${image.mime};base64,${compressedImage}`);
          setAvatarFilename(image.filename);
          modalizeOpen();
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const editInfo = async (
    nameEdit: any,
    avatarEdit: any,
    aboutEdit: any,
    avatarFilenameEdit: any,
  ) => {
    try {
      dispatch({
        type: 'updateUserRequest',
      });
      if (avatarEdit != null && avatarFilenameEdit != null) {
        await requestImageModeration(avatar, avatarFilename);
      }
      if (about !== user.about) {
        await requestTextModeration(about);
      }
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
      setAvatarFilename(null);
    } catch (err: any) {
      dispatch({
        type: 'updateUserFailed',
        payload: err.message,
      });
    }
  };

  const isValidData = () => {
    let errors = {};
    const validName =
      checkEmpty(name, 'Name is required.') ||
      checkRegex(name, 'Name is invalid.', FULLNAME_REGEX);
    if (validName) {
      errors['name'] = validName;
    }
    setValidError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOnPress = () => {
    if (isValidData()) {
      editInfo(name, avatar, about, avatarFilename);
    }
  };

  const fetchPosts = async (page: number) => {
    const res = await getPostOfUser({
      targetId: user.id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    dispatch({type: 'addMyPost', payload: res});
    setNextPage(res.page + 1);
    setTotalPages(res.totalPages);
  };

  const fetchPostTags = async (page: number) => {
    const res = await getPostTagged({
      targetId: user.id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    dispatch({type: 'addMyPostTag', payload: res});
    setNextPageTagged(res.page + 1);
    setTotalPagesTagged(res.totalPages);
  };

  const fetchPostHiden = async (page: number) => {
    const res = await getPostHiden({
      targetId: user.id,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    });
    dispatch({type: 'addMyPostHide', payload: res});
    setNextPageHiden(res.page + 1);
    setTotalPagesHiden(res.totalPages);
  };

  const renderItem = ({item}) => {
    return <PostThumbnail id={item.id} uri={item.source} userId={user.id} />;
  };

  const handleStateChange = (friend: any) => {
    dispatch({
      type: 'removeFriend',
      payload: {
        id: friend.id,
      },
    });
    dispatch({type: 'removePostByUserId', payload: {id: friend.id}});
  };

  const PostRoute = () => (
    <FlatList
      numColumns={3}
      data={myPost}
      showsVerticalScrollIndicator={false}
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
            <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
          )}
        </View>
      )}
      onEndReachedThreshold={0.8}
      onEndReached={() => {
        if (nextPage < totalPages && !isLoading) {
          fetchPosts(nextPage);
        }
      }}
      renderItem={renderItem}
      // keyExtractor={item => item.id.toString()}
    />
  );

  const TagRoute = () => (
    <FlatList
      numColumns={3}
      data={myPostTag}
      showsVerticalScrollIndicator={false}
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
            <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
          )}
        </View>
      )}
      onEndReachedThreshold={0.8}
      onEndReached={() => {
        if (nextPageTagged < totalPagesTagged && !isLoading) {
          fetchPostTags(nextPageTagged);
        }
      }}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );

  const HideRoute = () => (
    <FlatList
      numColumns={3}
      data={myPostHide}
      showsVerticalScrollIndicator={false}
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
            <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
          )}
        </View>
      )}
      onEndReachedThreshold={0.8}
      onEndReached={() => {
        if (nextPageHiden < totalPagesHiden && !isLoading) {
          fetchPostHiden(nextPageTagged);
        }
      }}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );

  const renderIcon = ({route, color}: {route: Route; color: string}) => (
    <Feather name={route.icon} size={IconSizes.x6} color={color} />
  );

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <TabBar
      {...props}
      style={[
        styles(theme).defaultBackground,
        {elevation: 0, shadowOpacity: 0, borderBottomWidth: 0},
      ]}
      labelStyle={{
        ...FontWeights.Regular,
        ...FontSizes.Body,
        color: theme.text01,
      }}
      indicatorStyle={{backgroundColor: theme.placeholder}}
      renderIcon={renderIcon}
    />
  );

  let content =
    loading || error ? (
      <ProfileScreenPlaceholder viewMode />
    ) : (
      <>
        <ProfileCard
          avatar={user.avatar}
          name={user.name}
          about={user.about}
          posts={totalMyPost}
          friends={totalFriends}
          onFriendsOpen={onFriendsOpen}
          onOptionPress={modalizeOpen}
          editable
        />
        <TabView
          navigationState={{index, routes}}
          renderScene={SceneMap({
            post: PostRoute,
            tag: TagRoute,
            hide: HideRoute,
          })}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{
            height: 0,
            width: SCREEN_WIDTH,
          }}
        />
        <ConnectionsBottomSheet
          ref={friendsBottomSheetRef}
          datas={friends}
          name={user.name}
          onStateChange={handleStateChange}
          fetchMore={(page: number) =>
            getFriendList({
              pageNumber: page,
              pageSize: Pagination.PAGE_SIZE,
            })
          }
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
        adjustToContentHeight
        onClosed={() => {
          setValidError({});
        }}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
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
          <View style={[{flex: 1}, space(IconSizes.x5).mt]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleOnPress}
              disabled={userLoading}
              style={[styles(theme).button, styles(theme).buttonPrimary]}>
              {userLoading ? (
                <LoadingIndicator
                  size={IconSizes.x1}
                  color={ThemeStatic.white}
                />
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
            {Object.values(validError).map((errMessage: any, i: number) => (
              <Text
                key={i}
                style={{
                  ...FontWeights.Regular,
                  ...FontSizes.Caption,
                  color: 'red',
                }}>
                {errMessage}
              </Text>
            ))}
          </View>
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
            onPress={() => editInfo(name, null, about, null)}
          />
        </View>
      </Modalize>
    </GestureHandlerRootView>
  );
};

export default MyProfile;

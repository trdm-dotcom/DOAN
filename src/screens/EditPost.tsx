import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {useContext, useEffect, useRef, useState} from 'react';
import {getPostDetail, updatePost} from '../reducers/action/post';
import {getHash} from '../utils/Crypto';
import {getFriendList, searchFriend} from '../reducers/action/friend';
import {IconSizes, Pagination} from '../constants/Constants';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {space, styles} from '../components/style';
import React from 'react';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../theme/Typography';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeImage} from '../components/shared/NativeImage';
import {MaterialIndicator} from 'react-native-indicators';
import {ThemeStatic} from '../theme/Colors';
import Feather from 'react-native-vector-icons/Feather';
import ConnectionsPlaceholder from '../components/placeholder/Connections.Placeholder';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import {Modalize} from 'react-native-modalize';
import CheckBox from 'react-native-check-box';
import {useSelector} from 'react-redux';
import {AppContext} from '../context';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import EditPostScreenPlaceholder from '../components/placeholder/EditPost.Placeholder';
import {showError} from '../utils/Toast';
import {MentionInput} from 'react-native-controlled-mentions';
import Suggestions from '../components/shared/Suggestions';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

const EditPost = ({navigation, route}: props) => {
  const {user} = useSelector((state: any) => state.user);
  const {theme} = useContext(AppContext);
  const {postId} = route.params;

  const [post, setPost] = useState<any>({author: {}});
  const [caption, setCaption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [choose, setChoose] = useState<any[]>(post.tags);
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const tagBottomSheetRef = useRef();

  const openTagBottomSheet = () => {
    // @ts-ignore
    return tagBottomSheetRef.current.open();
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = () => {
    setLoading(true);
    getPostDetail({post: postId})
      .then(res => {
        setPost(res);
        setCaption(res.caption);
        setTags(res.tags.map((item: any) => item.id));
        setChoose(res.tags);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doUpdatePost = () => {
    setLoading(true);
    const body = {
      post: post.id,
      hash: getHash('UPDATE_POST'),
      tags: tags,
      caption: caption,
    };
    updatePost(body)
      .catch((err: any) => {
        setError(true);
        showError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFriends = (page: number) => {
    setIsLoading(true);
    getFriendList({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })
      .then(response => {
        setFriends(response.datas);
        setNextPage(response.page + 1);
        setTotalPages(response.totalPages);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const identifyKeyword = (text: string) => {
    const pattern = new RegExp('\\B@[a-z0-9_-]+|\\B@', 'gi');
    const keywordArray = text.match(pattern);
    if (keywordArray && !!keywordArray.length) {
      const lastKeyword = keywordArray[keywordArray.length - 1];
      if (lastKeyword.slice(1).trim().length > 0) {
        searchFriend({search: lastKeyword.slice(1)}).then(res => {
          setSuggestions(res);
        });
      }
    }
  };

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  let content =
    loading || error ? (
      <EditPostScreenPlaceholder />
    ) : user.id === post.author.id ? (
      <>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={20}>
          <NativeImage
            uri={post.source}
            style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}
          />
          <View
            style={[
              styles(theme).inputContainer,
              {borderRadius: 40},
              space(IconSizes.x8).mt,
            ]}>
            <MentionInput
              containerStyle={[styles(theme).inputField]}
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
              ]}
              value={caption}
              placeholder="Add a caption..."
              onChange={(text: string) => {
                identifyKeyword(text);
                setCaption(text);
              }}
              partTypes={[
                {
                  trigger: '@',
                  textStyle: {
                    ...FontWeights.Regular,
                    ...FontSizes.Body,
                    color: '#244dc9',
                  },
                  renderSuggestions: Suggestions(suggestions),
                },
              ]}
            />
          </View>
          <View>
            <Text
              style={[
                {
                  ...FontWeights.Bold,
                  ...FontSizes.Body,
                  color: theme.text01,
                },
                space(IconSizes.x1).mv,
              ]}>
              {choose.length > 0
                ? `You tagged ${choose.length} friends`
                : 'Tag friends'}
            </Text>
            <View
              style={[
                styles(theme).row,
                {
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                },
              ]}>
              <FlatList
                data={choose}
                keyExtractor={item => item.id.toString()}
                horizontal
                renderItem={({item}) => (
                  <NativeImage
                    uri={item.avatar}
                    style={[
                      {
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        backgroundColor: theme.placeholder,
                      },
                      space(IconSizes.x1).ml,
                    ]}
                  />
                )}
              />
            </View>
          </View>
          <View
            style={[
              styles(theme).row,
              {
                justifyContent: 'space-around',
                alignItems: 'center',
              },
              space(IconSizes.x8).mv,
            ]}>
            <View />
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
                <MaterialIndicator
                  size={IconSizes.x9}
                  color={ThemeStatic.white}
                />
              ) : (
                <Ionicons
                  name="paper-plane"
                  size={IconSizes.x9}
                  color={theme.text01}
                />
              )}
            </TouchableOpacity>
            <IconButton
              Icon={() => (
                <Feather name="tag" size={IconSizes.x9} color={theme.text01} />
              )}
              onPress={openTagBottomSheet}
            />
          </View>
        </KeyboardAvoidingView>
        <Modalize
          ref={tagBottomSheetRef}
          onOpen={() => {
            fetchFriends(0);
          }}
          modalStyle={[styles(theme).modalizeContainer]}
          adjustToContentHeight
          HeaderComponent={
            <BottomSheetHeader
              heading="Your friends"
              subHeading={'Below are the people you can tag.'}
            />
          }
          flatListProps={{
            data: friends,
            renderItem: ({item}) => (
              <View
                style={[
                  styles(theme).userCardContainer,
                  space(IconSizes.x1).mt,
                ]}>
                <View style={[styles(theme).row]}>
                  <NativeImage
                    uri={item.avatar}
                    style={styles(theme).tinyImage}
                  />
                  <Text
                    style={[styles(theme).nameText, space(IconSizes.x1).ml]}>
                    {item.name}
                  </Text>
                </View>
                <CheckBox
                  onClick={() => {
                    const index = tags.indexOf(item.friendId);
                    if (index > -1) {
                      setTags(tags.filter(tag => tag !== item.friendId));
                      setChoose(choose.filter(it => it.id !== item.friendId));
                    } else {
                      setTags([...tags, item.friendId]);
                      setChoose([
                        ...choose,
                        {
                          ...item,
                          id: item.friendId,
                        },
                      ]);
                    }
                  }}
                  isChecked={tags.includes(item.friendId)}
                  checkBoxColor={theme.text02}
                  checkedCheckBoxColor={ThemeStatic.accent}
                />
              </View>
            ),
            keyExtractor: item => item.id,
            onEndReachedThreshold: 0.8,
            onEndReached: () => {
              if (nextPage < totalPages) {
                fetchFriends(nextPage);
              }
            },
            showsVerticalScrollIndicator: false,
            ListEmptyComponent: () =>
              isLoading ? (
                <ConnectionsPlaceholder />
              ) : (
                <ListEmptyComponent listType="users" spacing={30} />
              ),
          }}
        />
      </>
    ) : (
      <View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10,
            height: responsiveHeight(20),
          },
        ]}>
        <Text
          style={[
            {
              ...FontWeights.Light,
              ...FontSizes.Label,
              color: theme.text02,
            },
          ]}>
          Sorry, this page isn't available
        </Text>
      </View>
    );

  return (
    <GestureHandlerRootView
      style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            Icon={() => (
              <Ionicons
                name="arrow-back-outline"
                size={IconSizes.x8}
                color={theme.text01}
              />
            )}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      {content}
    </GestureHandlerRootView>
  );
};

export default EditPost;

import React, {useContext, useRef, useState} from 'react';
import {AppContext} from '../context';
import {
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination} from '../constants/Constants';
import IconButton from '../components/control/IconButton';
import {NativeImage} from '../components/shared/NativeImage';
import {RootStackParamList} from '../navigators/RootStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderBar from '../components/header/HeaderBar';
import Typography from '../theme/Typography';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {getHash} from '../utils/Crypto';
import {upPost} from '../reducers/action/post';
import {IParam} from '../models/IParam';
import {ThemeStatic} from '../theme/Colors';
import {showError} from '../utils/Toast';
import {Modalize} from 'react-native-modalize';
import Option from '../components/shared/Option';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {MaterialIndicator} from 'react-native-indicators';
import {Image as ImageCompressor} from 'react-native-compressor';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheetHeader from '../components/header/BottomSheetHeader';
import ConnectionsPlaceholder from '../components/placeholder/Connections.Placeholder';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import {getFriendList, searchFriend} from '../reducers/action/friend';
import CheckBox from 'react-native-check-box';
import Suggestions from '../components/shared/Suggestions';
import {MentionInput} from 'react-native-controlled-mentions';
import PhotoEditor from '@baronha/react-native-photo-editor';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;
const Camera = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [imageSource, setImageSource] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [caption, setCaption] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [choose, setChoose] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const cameraOptionsBottomSheetRef = useRef();
  const tagBottomSheetRef = useRef();

  const openOptions = () => {
    // @ts-ignore
    return cameraOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return cameraOptionsBottomSheetRef.current.close();
  };

  const openTagBottomSheet = () => {
    // @ts-ignore
    return tagBottomSheetRef.current.open();
  };

  const doUpPost = async () => {
    try {
      setLoading(true);
      const imageData = await ImageCompressor.compress(imageSource, {
        maxHeight: 720,
        maxWidth: 720,
        input: 'uri',
        compressionMethod: 'auto',
        quality: 0.6,
        returnableOutputType: 'base64',
      });
      const body: IParam = {
        source: `data:image/jpeg;base64,${imageData}`,
        caption: caption,
        tags: tags,
        hash: getHash('UP_POST'),
      };
      await upPost(body);
      setCaption(null);
      setImageSource(null);
      setSuggestions([]);
      setChoose([]);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onOpenGallery = () => {
    closeOptions();
    ImagePicker.openPicker({
      compressImageQuality: 0.6,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        setImageSource(image.path);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onOpenCamera = () => {
    closeOptions();
    ImagePicker.openCamera({
      compressImageQuality: 0.6,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        setImageSource(image.path);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onEdit = () => {
    PhotoEditor.open({path: imageSource, stickers: []})
      .then(result => {
        setImageSource(result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchFriends = async (page: number) => {
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
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={20}>
        <TouchableOpacity
          onPress={openOptions}
          style={[styles(theme).cameraContainer, space(IconSizes.x5).mt]}>
          {imageSource == null ? (
            <>
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.SubHeading,
                    color: ThemeStatic.accent,
                  },
                  space(IconSizes.x5).mt,
                ]}>
                Upload your photo
              </Text>
            </>
          ) : (
            <NativeImage
              uri={imageSource}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </TouchableOpacity>
        <MentionInput
          containerStyle={[styles(theme).inputField]}
          style={[
            {
              ...FontWeights.Bold,
              ...FontSizes.Body,
              color: theme.text01,
            },
          ]}
          placeholderTextColor={theme.text02}
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
          <TouchableOpacity disabled={imageSource == null} onPress={onEdit}>
            <Ionicons
              name="options-outline"
              size={IconSizes.x9}
              color={theme.text01}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={doUpPost}
            activeOpacity={0.9}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              borderRadius: 60,
              height: 90,
              width: 90,
            }}
            disabled={loading}>
            {loading ? (
              <MaterialIndicator
                size={IconSizes.x9}
                color={ThemeStatic.accent}
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
              style={[styles(theme).userCardContainer, space(IconSizes.x1).mt]}>
              <View style={[styles(theme).row]}>
                <NativeImage
                  uri={item.avatar}
                  style={styles(theme).tinyImage}
                />
                <Text style={[styles(theme).nameText, space(IconSizes.x1).ml]}>
                  {item.name}
                </Text>
              </View>
              <CheckBox
                onClick={() => {
                  const index = tags.indexOf(item.friendId);
                  if (index > -1) {
                    setTags(tags.filter(tag => tag !== item.friendId));
                    setChoose(
                      choose.filter(it => it.friendId !== item.friendId),
                    );
                  } else {
                    setTags([...tags, item.friendId]);
                    setChoose([...choose, item]);
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
      <Modalize
        ref={cameraOptionsBottomSheetRef}
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
            onPress={onOpenCamera}
          />
          <Option
            label="Choose from gallery"
            iconName="images-outline"
            color={theme.text01}
            onPress={onOpenGallery}
          />
          <Option
            label="Delete"
            iconName="close-circle-outline"
            color="red"
            onPress={() => {
              setImageSource(null);
              closeOptions();
            }}
          />
        </View>
      </Modalize>
    </GestureHandlerRootView>
  );
};

export default Camera;

import React, {useContext, useRef, useState} from 'react';
import {AppContext} from '../context';
import {
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {space, styles} from '../components/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import IconButton from '../components/control/IconButton';
import {NativeImage} from '../components/shared/NativeImage';
import Header from '../components/header/Header';
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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MaterialIndicator} from 'react-native-indicators';

const {FontWeights, FontSizes} = Typography;

type props = NativeStackScreenProps<RootStackParamList, 'Camera'>;
const Camera = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [imageSource, setImageSource] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [caption, setCaption] = useState<any>(null);

  const cameraOptionsBottomSheetRef = useRef();

  const openOptions = () => {
    // @ts-ignore
    return cameraOptionsBottomSheetRef.current.open();
  };

  const closeOptions = () => {
    // @ts-ignore
    return cameraOptionsBottomSheetRef.current.close();
  };

  const doUpPost = async () => {
    try {
      setLoading(true);
      const body: IParam = {
        source: imageSource,
        caption: caption,
        hash: getHash('UP_POST'),
      };
      await upPost(body);
      setCaption(null);
      setImageSource(null);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {};

  const onOpenGallery = () => {
    closeOptions();
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        if (image.data != null) {
          setImageSource(`data:${image.mime};base64,${image.data}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onOpenCamera = () => {
    closeOptions();
    ImagePicker.openCamera({
      compressImageQuality: 0.8,
      includeBase64: true,
      writeTempFile: false,
    })
      .then((image: Image) => {
        if (image.data != null) {
          setImageSource(`data:${image.mime};base64,${image.data}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      <View
        style={[
          styles(theme).row,
          {
            justifyContent: 'space-between',
          },
        ]}>
        <Header title="Create New Post" />
      </View>
      <KeyboardAvoidingView
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
        <View
          style={[
            styles(theme).inputContainer,
            {borderRadius: 40},
            space(IconSizes.x8).mt,
          ]}>
          <TextInput
            onChangeText={(text: string) => {
              setCaption(text.trim());
            }}
            style={[
              styles(theme).inputField,
              {
                ...FontWeights.Bold,
                ...FontSizes.Body,
                color: theme.text01,
              },
            ]}
            placeholder="Add a caption..."
            placeholderTextColor={theme.text02}
          />
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
          <IconButton
            Icon={() => (
              <Ionicons name="close" size={IconSizes.x9} color={theme.text01} />
            )}
            onPress={() => {
              setImageSource(null);
              closeOptions();
            }}
          />
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
              <Ionicons
                name="download-outline"
                size={IconSizes.x9}
                color={theme.text01}
              />
            )}
            onPress={download}
          />
        </View>
      </KeyboardAvoidingView>
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

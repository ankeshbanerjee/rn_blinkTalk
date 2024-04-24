import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import {RootStackParamsList} from '../navigation/params';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ColorAssets from '../theme/colors';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';
import {isVideoUrl} from '../utils/apputils';
import VideoPlayer from 'react-native-video-player';
import PagerView from 'react-native-pager-view';
import Pinchable from 'react-native-pinchable';
import {useFocusEffect} from '@react-navigation/native';

const screen = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamsList, 'IMAGE_VIEW'>;

const ImageView: React.FC<Props> = ({navigation, route}) => {
  const singleImgUri = route.params.imageUri;
  const mediaInfo = route.params.mediaInfo;
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(
    'PORTRAIT',
  );

  // listening to orientation change, so that it returns window's height and width accordingly
  useFocusEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setOrientation('PORTRAIT');
      } else {
        setOrientation('LANDSCAPE');
      }
    });
  });

  return (
    <>
      <StatusBar hidden />
      {mediaInfo ? (
        <PagerView
          style={{
            flex: 1,
            backgroundColor: '#000000',
          }}
          initialPage={mediaInfo.currIndex}>
          {mediaInfo.media.map((item, index) => {
            return !isVideoUrl(item ?? '') ? (
              <Pinchable key={index}>
                <Image
                  source={{uri: item}}
                  style={{
                    height: Dimensions.get('window').height,
                  }}
                  resizeMode="contain"
                />
              </Pinchable>
            ) : (
              <View style={{flex: 1, justifyContent: 'center'}} key={index}>
                <VideoPlayer
                  video={{
                    uri: item,
                  }}
                  showDuration={true}
                  style={{
                    height: Dimensions.get('window').height,
                  }}
                />
              </View>
            );
          })}
        </PagerView>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
          }}>
          {!isVideoUrl(singleImgUri ?? '') ? (
            <Pinchable>
              <Image
                source={{uri: singleImgUri}}
                style={{
                  height: Dimensions.get('window').height,
                }}
                resizeMode="contain"
              />
            </Pinchable>
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <VideoPlayer
                video={{
                  uri: singleImgUri,
                }}
                showDuration={true}
                style={{
                  height: Dimensions.get('window').height,
                }}
                // style={{
                //   height:
                //     orientation === 'LANDSCAPE'
                //       ? Dimensions.get('window').height
                //       : verticalScale(200),
                // }}
                // customStyles={{
                //   wrapper:
                //     orientation === 'PORTRAIT'
                //       ? {
                //           width: Dimensions.get('window').width,
                //         }
                //       : undefined,
                // }}
              />
            </View>
          )}
        </View>
      )}

      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 30,
          right: 10,
          backgroundColor: ColorAssets.gray700,
          borderRadius: 50,
          padding: moderateScale(10),
        }}>
        <AntDesign name="close" color={'#ffffff'} size={RFValue(16)} />
      </Pressable>
    </>
  );
};

export default ImageView;

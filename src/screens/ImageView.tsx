import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video, {OnProgressData, VideoRef} from 'react-native-video';
import PagerView from 'react-native-pager-view';
import Pinchable from 'react-native-pinchable';
import SimpleText from '../components/SimpleText';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamsList} from '../navigation/params';
import {isVideoUrl} from '../utils/apputils';
import ColorAssets from '../theme/colors';

const screen = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamsList, 'IMAGE_VIEW'>;

const dummyVdo = 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

const ImageView: React.FC<Props> = ({navigation, route}) => {
  const singleImgUri = route.params.imageUri;
  const mediaInfo = route.params.mediaInfo;
  const [selectedPage, setSelectedPage] = useState(
    route.params.mediaInfo?.currIndex ?? 0,
  );

  return (
    <>
      <StatusBar hidden />
      {mediaInfo ? (
        <PagerView
          style={{
            flex: 1,
            backgroundColor: '#000000',
          }}
          onPageSelected={e => {
            console.log(e.nativeEvent.position);
            setSelectedPage(e.nativeEvent.position);
          }}
          useNext
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
              // <View style={{flex: 1, justifyContent: 'center'}} key={index}>
              //   <Video
              //     source={{
              //       uri: item,
              //     }}
              //     paused={index !== selectedPage}
              //     resizeMode="contain"
              //     style={{
              //       height: Dimensions.get('window').height,
              //       width: '100%',
              //       backgroundColor: COLORS.black,
              //     }}
              //     playInBackground={false}
              //     playWhenInactive={false}
              //   />
              // </View>
              <VideoPlayer
                key={index}
                url={item}
                isPaused={index !== selectedPage}
              />
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
              {/* <Video
                source={{
                  uri: singleImgUri,
                }}
                resizeMode="contain"
                controls
                style={{
                  height: Dimensions.get('window').height,
                  width: '100%',
                  backgroundColor: COLORS.black,
                }}
                playInBackground={false}
                playWhenInactive={false}
              /> */}
              <VideoPlayer url={singleImgUri!} isPaused={false} />
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
          padding: 12,
        }}>
        <AntDesign name="close" color={'#ffffff'} size={18} />
      </Pressable>
    </>
  );
};

const VideoPlayer: FC<{url: string; isPaused: boolean}> = ({url, isPaused}) => {
  const [paused, setPaused] = useState(isPaused);
  const [clicked, setClicked] = useState<boolean>(false);
  const ref = useRef<VideoRef>(null);
  const [progress, setProgress] = useState<OnProgressData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const format = (seconds: number): string => {
    let mins = parseInt((seconds / 60).toString())
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  return (
    <>
      <Pressable
        style={{flex: 1, justifyContent: 'center'}}
        onPress={() => setClicked(p => !p)}>
        <Video
          source={{
            uri: url,
          }}
          ref={ref}
          paused={paused}
          onProgress={(x: OnProgressData) => {
            setProgress(x);
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onBuffer={e => setIsLoading(e.isBuffering)}
          resizeMode="contain"
          style={{
            height: Dimensions.get('window').height,
            width: '100%',
            backgroundColor: ColorAssets.black,
          }}
          playInBackground={false}
          playWhenInactive={false}
        />
        {clicked ? (
          <Pressable
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
            onPress={() => {
              setClicked(p => !p);
            }}>
            <View style={{flexDirection: 'row', zIndex: 2}}>
              <Pressable
                onPress={() => {
                  if (ref.current) {
                    ref.current.seek((progress?.currentTime || 0) - 10);
                  }
                }}>
                <MaterialIcons
                  name="replay-10"
                  size={30}
                  color={ColorAssets.white}
                />
              </Pressable>
              {!isLoading ? (
                <Pressable
                  onPress={() => {
                    setPaused(p => !p);
                  }}>
                  <MaterialIcons
                    name={paused ? 'play-arrow' : 'pause'}
                    size={30}
                    color={ColorAssets.white}
                    style={{marginLeft: 45}}
                  />
                </Pressable>
              ) : (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    marginLeft: 45,
                  }}
                />
              )}
              <Pressable
                onPress={() => {
                  if (ref.current) {
                    ref.current.seek((progress?.currentTime || 0) + 10);
                  }
                }}>
                <MaterialIcons
                  name="forward-10"
                  size={30}
                  color={ColorAssets.white}
                  style={{marginLeft: 45}}
                />
              </Pressable>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                paddingLeft: 15,
                paddingRight: 15,
                alignItems: 'center',
                zIndex: 2,
              }}>
              <SimpleText style={{color: ColorAssets.white}}>
                {format(progress?.currentTime || 0)}
              </SimpleText>
              <Slider
                style={{width: '80%', height: 38}}
                minimumValue={0}
                maximumValue={progress?.seekableDuration || 0}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#fff"
                onValueChange={x => {
                  if (ref.current) {
                    ref.current.seek(x);
                  }
                }}
                value={progress?.currentTime}
              />
              <SimpleText style={{color: 'white'}}>
                {format(progress?.seekableDuration || 0)}
              </SimpleText>
            </View>
          </Pressable>
        ) : null}
      </Pressable>
      {isLoading ? (
        <ActivityIndicator
          color={ColorAssets.blue500}
          size={20}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : null}
    </>
  );
};

export default ImageView;

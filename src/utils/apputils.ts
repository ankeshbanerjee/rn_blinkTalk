import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNavigationContainerRef} from '@react-navigation/native';
import {Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-simple-toast';

export const rootNavigationRef = createNavigationContainerRef();

export type UiState = 'loading' | 'success' | 'idle' | 'failure' | 'refreshing';

export type TaskType = 'due' | 'today' | 'completed';

export const showToast = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Toast.showWithGravity(msg, Toast.LONG, Toast.BOTTOM);
  }
};

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
    // showToast('Unexpected Error Occurred');
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
    // showToast('Unexpected Error Occurred');
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export function isVideoUrl(url: string): boolean {
  // List of common video file extensions
  const videoExtensions = [
    '.mp4',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    '.mkv',
    '.webm',
    '.ogg',
    '.3gp',
    '.mpeg',
  ];

  // Check if the URL contains a video file extension
  const hasVideoExtension = videoExtensions.some(ext =>
    url.toLowerCase().endsWith(ext),
  );

  return hasVideoExtension;
}

export function get_url_extension(url: string): string {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

export function isImageUrl(url: string): boolean {
  const imageExtensions: string[] = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
  ];
  const lowerCaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
}

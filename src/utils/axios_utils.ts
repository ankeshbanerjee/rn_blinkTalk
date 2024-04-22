import axios from 'axios';
import {Constant} from './constant';
import {showToast} from './apputils';
import {fetch} from '@react-native-community/netinfo';

export const initService = async (token?: string) => {
  console.log('token is', token);
  if (token !== undefined) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
  axios.defaults.baseURL = Constant.BASE_URL;
  // axios.defaults.timeout = 5000;
  // axios.defaults.timeoutErrorMessage =
  //   'Connection time out...\nCheck network connecton';
};

export const safeApiCall = async (
  call: () => Promise<void>,
  onError: () => void = () => {},
) => {
  const networkStatus = await fetch();
  if (!networkStatus.isConnected) {
    onError();
    console.log('No Internet Connection');
    return;
  }
  call().catch((error: any) => {
    onError();
    try {
      console.log(error?.response?.data?.message);
      const errorMsg = error?.response?.data?.message;
      if (errorMsg !== undefined) {
        showToast(errorMsg);
      } else {
        showToast('Something Went Wrong');
      }
    } catch (e) {
      console.log('some error', e);
      showToast('Something Went Wrong');
    }
  });
};

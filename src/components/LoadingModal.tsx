import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import {ActivityIndicator} from 'react-native';
import ColorAssets from '../theme/colors';

const LoadingModal = ({visible}: {visible: boolean}) => {
  return (
    <Modal visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={ColorAssets.white} />
      </View>
    </Modal>
  );
};

export default LoadingModal;

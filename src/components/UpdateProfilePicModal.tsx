import {StyleSheet, Text, View, Modal, Image, Pressable} from 'react-native';
import React, {FC, useContext, useState} from 'react';
import SimpleText from './SimpleText';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button} from 'react-native-paper';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import {safeApiCall} from '../utils/axios_utils';
import {UserContext} from '../contexts/UserContext';
import {UiState, showToast} from '../utils/apputils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RippleButton from './ripple_button';
import ColorAssets from '../theme/colors';
import {updateProfile, uploadSingleFile} from '../services/user_services';
import {launchImageLibrary} from 'react-native-image-picker';
import LoadingModal from './LoadingModal';

interface Props {
  imgUrl: string;
  userName: string;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  viewImage: () => void;
}

const UpdateProfilePicModal: FC<Props> = ({
  imgUrl,
  userName,
  modalVisible,
  setModalVisible,
  viewImage,
}) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [uiState, setUiState] = useState<UiState>('idle');
  const {loadUser} = useContext(UserContext);

  function handleUpdateProfilePic() {
    safeApiCall(
      async () => {
        const picRes = await launchImageLibrary({mediaType: 'photo'});
        if (!picRes.assets) return;
        showToast('Updating...');
        const pic = picRes.assets[0];
        const formData = new FormData();
        const picData = {
          uri: pic.uri,
          name: pic.fileName,
          type: pic.type,
        };
        formData.append('file', picData);
        formData.append('category', 'Profile Picture');
        setUiState('loading');
        const res = await uploadSingleFile(formData);
        const newImgUrl = res.data.result.fileUrl;
        const res1 = await updateProfile('profilePicture', newImgUrl);
        loadUser(res1.data.result.user);
        showToast(res1.data.message);
        setUiState('success');
        setModalVisible(false);
      },
      () => {
        setUiState('failure');
      },
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <Pressable
        style={styles.modalBgContainer}
        onPress={function () {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <RippleButton
            onPress={() => setModalVisible(false)}
            style={styles.closeIcon}>
            <MaterialCommunityIcons
              name="close"
              size={RFValue(20)}
              color={theme.blackInverse}
              style={{alignSelf: 'center'}}
            />
          </RippleButton>
          <Image source={{uri: imgUrl}} style={styles.image} />
          <SimpleText
            fontWeight="semi-bold"
            style={{alignSelf: 'center', fontSize: RFValue(15)}}>
            {userName}
          </SimpleText>
          <Button
            icon="image"
            mode="contained"
            textColor={ColorAssets.white}
            buttonColor={theme.primaryColor}
            labelStyle={{
              fontSize: RFValue(13),
              fontFamily: 'Inter-Bold',
            }}
            style={{
              borderRadius: RFValue(5),
              marginTop: verticalScale(10),
              //   width: '45%',
            }}
            onPress={viewImage}>
            View Image
          </Button>
          <Button
            icon="image-edit"
            mode="contained"
            textColor={ColorAssets.white}
            buttonColor={theme.primaryColor}
            labelStyle={{
              fontSize: RFValue(13),
              fontFamily: 'Inter-Bold',
            }}
            style={{
              borderRadius: RFValue(5),
              marginTop: verticalScale(10),
              //   width: '45%',
            }}
            onPress={handleUpdateProfilePic}>
            Update Image
          </Button>
        </View>
      </Pressable>
      <LoadingModal visible={uiState === 'loading'} />
    </Modal>
  );
};

export default UpdateProfilePicModal;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    modalBgContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: theme.surfaceVariant,
      padding: moderateScale(20),
      //   borderTopLeftRadius: 15,
      //   borderTopRightRadius: 15,
      borderRadius: 15,
    },
    modalHeader: {
      fontSize: RFValue(15),
      paddingBottom: verticalScale(15),
      alignSelf: 'center',
    },
    sectionHeader: {marginBottom: verticalScale(5), fontSize: RFValue(14)},
    image: {
      height: verticalScale(100),
      width: verticalScale(100),
      borderRadius: verticalScale(50),
      alignSelf: 'center',
      marginBottom: verticalScale(10),
    },
    closeIcon: {
      width: moderateScale(30),
      alignSelf: 'flex-end',
    },
  });

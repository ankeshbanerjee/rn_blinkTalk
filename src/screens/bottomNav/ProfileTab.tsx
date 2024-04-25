import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import SimpleText from '../../components/SimpleText';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomNavParamsList} from '../../navigation/params';
import {ThemeContext} from '../../contexts/theme_context';
import {ThemeData} from '../../theme/theme_data';
import {UserContext} from '../../contexts/UserContext';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import ColorAssets from '../../theme/colors';
import HomeAppBar from '../../components/HomeAppBar';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {gs} from '../../theme/global_styles';
import Divider from '../../components/Divider';
import RippleButton from '../../components/ripple_button';
import {
  getData,
  removeData,
  showToast,
  storeData,
  UiState,
} from '../../utils/apputils';
import {Constant} from '../../utils/constant';
import {safeApiCall} from '../../utils/axios_utils';
import BottomSheetComponent, {
  BottomSheetRefType,
} from '../../components/BottomSheetComponent';
import IconTextField2 from '../../components/IconTextField2';
import {IconTextFieldRefProps} from '../../components/IconTextField';
import {Button, IconButton} from 'react-native-paper';
import {updateProfile} from '../../services/user_services';
import LoadingModal from '../../components/LoadingModal';
import moment from 'moment';
import UpdateProfilePicModal from '../../components/UpdateProfilePicModal';

type Props = BottomTabScreenProps<BottomNavParamsList, 'PROFILE'>;

const ProfileTab: React.FC<Props> = ({navigation}) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const {user, deleteUser, loadUser} = useContext(UserContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme.isDark);
  const bottomSheetRef = useRef<BottomSheetRefType>(null);
  const nameRef = useRef<IconTextFieldRefProps>(null);
  const [uiState, setUiState] = useState<UiState>('idle');
  const [isModalVis, setIsModalVis] = useState<boolean>(false);

  function handleLogout() {
    Alert.alert('Logout', 'Do you want to logout from your current account?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          safeApiCall(async () => {
            await removeData(Constant.AUTH_TOKEN);
            navigation.getParent()?.reset({routes: [{name: 'LOGIN'}]});
            deleteUser();
          });
        },
      },
    ]);
  }

  // const getTheme = async () => {
  //   const theme = await getData(Constant.THEME_DATA);
  //   if (theme && theme === 'dark_theme') {
  //     setIsDarkMode(true);
  //   }
  // };

  // useEffect(() => {
  //   getTheme();
  // }, []);

  return (
    <View style={styles.container}>
      <HomeAppBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(40),
        }}>
        <SimpleText fontWeight="semi-bold" style={styles.heading}>
          Your Profile
        </SimpleText>
        <View style={{marginBottom: -40}}>
          <Image
            source={{uri: user?.profilePicture}}
            style={styles.profilePic}
          />
          <IconButton
            icon={'image-edit-outline'}
            containerColor={theme.primaryColor}
            iconColor={ColorAssets.white}
            style={{alignSelf: 'center', top: -40, right: -50}}
            onPress={function () {
              setIsModalVis(true);
            }}
          />
        </View>

        <View style={[gs.row, styles.section]}>
          <MaterialCommunityIcons
            name="account-outline"
            size={RFValue(24)}
            color={theme.secondaryContainer}
          />
          <View style={{gap: verticalScale(6), flex: 1}}>
            <SimpleText
              style={{color: theme.secondaryColor}}
              size={RFValue(14)}>
              {user?.name}
            </SimpleText>
            <SimpleText
              style={{color: theme.secondaryContainer, fontSize: RFValue(10)}}>
              Your Name
            </SimpleText>
          </View>
          <RippleButton
            style={[gs.row, {}]}
            onPress={function () {
              bottomSheetRef.current?.present();
            }}>
            <AntDesign
              name="edit"
              size={RFValue(16)}
              color={theme.secondaryColor}
              style={{marginRight: 6}}
            />
            <SimpleText fontWeight="medium" color={theme.secondaryColor}>
              change
            </SimpleText>
          </RippleButton>
        </View>
        <Divider />
        <View style={[gs.row, styles.section]}>
          <MaterialCommunityIcons
            name="email-outline"
            size={RFValue(24)}
            color={theme.secondaryContainer}
          />
          <View style={{gap: verticalScale(6)}}>
            <SimpleText
              style={{color: theme.secondaryColor}}
              size={RFValue(14)}>
              {user?.email}
            </SimpleText>
            <SimpleText
              style={{color: theme.secondaryContainer, fontSize: RFValue(10)}}>
              Email ID
            </SimpleText>
          </View>
        </View>
        <Divider />
        <View style={[gs.row, styles.section]}>
          <MaterialCommunityIcons
            name="account-clock-outline"
            size={RFValue(24)}
            color={theme.secondaryContainer}
          />
          <View style={{gap: verticalScale(6)}}>
            <SimpleText
              style={{color: theme.secondaryColor}}
              size={RFValue(14)}>
              {moment(user?.createdAt).format('MMM D, YYYY [at] h:mm a')}
            </SimpleText>
            <SimpleText
              style={{color: theme.secondaryContainer, fontSize: RFValue(10)}}>
              Joined on
            </SimpleText>
          </View>
        </View>
        <Divider />
        <View style={[gs.row, styles.bottomSection]}>
          <View style={[gs.row, {gap: scale(14)}]}>
            <FontAwesome
              name="moon-o"
              color={theme.secondaryContainer}
              size={RFValue(24)}
            />
            <SimpleText
              style={{fontSize: RFValue(14), color: theme.secondaryColor}}>
              Dark Mode
            </SimpleText>
          </View>
          <Switch
            trackColor={{
              false: theme.secondaryColor,
              true: '#81b0ff',
            }}
            thumbColor={theme.onSecondary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async () => {
              setIsDarkMode(p => !p);
              if (!theme.isDark) {
                await storeData(Constant.THEME_DATA, 'dark_theme');
                toggleTheme();
              } else {
                await removeData(Constant.THEME_DATA);
                toggleTheme();
              }
            }}
            value={isDarkMode}
          />
        </View>
        <Divider />
        <RippleButton
          style={[gs.row, styles.bottomSection]}
          onPress={handleLogout}>
          <View style={[gs.row, {gap: scale(14)}]}>
            <MaterialCommunityIcons
              name="logout"
              color={ColorAssets.red600}
              size={RFValue(22)}
            />
            <SimpleText
              style={{fontSize: RFValue(14), color: ColorAssets.red600}}>
              Logout
            </SimpleText>
          </View>
          <Entypo
            name="chevron-right"
            color={ColorAssets.red600}
            size={RFValue(22)}
          />
        </RippleButton>
      </ScrollView>
      <BottomSheetComponent ref={bottomSheetRef} snapPoint={50}>
        <View
          style={{
            marginHorizontal: scale(16),
            marginTop: verticalScale(10),
            gap: verticalScale(14),
          }}>
          <SimpleText
            fontWeight="medium"
            size={RFValue(14)}
            color={theme.secondaryColor}>
            Change Your Name
          </SimpleText>
          <IconTextField2
            placeholder="Enter your name"
            title="Name"
            ref={nameRef}
            initialValue={user?.name}
          />
          <Button
            icon="content-save"
            mode="contained"
            textColor={ColorAssets.white}
            buttonColor={theme.primaryColor}
            labelStyle={{
              fontSize: 16,
              fontFamily: 'Inter-Bold',
            }}
            style={{
              alignSelf: 'center',
              borderRadius: scale(5),
              width: '100%',
            }}
            onPress={function () {
              const newName = nameRef.current?.getText();
              if (!newName || newName.trim().length === 0) {
                showToast('Please enter a valid name');
                return;
              }
              if (newName === user?.name) {
                showToast('Same as previous. Please change to update');
                return;
              }
              bottomSheetRef.current?.close();
              setUiState('loading');
              safeApiCall(
                async () => {
                  const res = await updateProfile('name', newName);
                  loadUser(res.data.result.user);
                  showToast(res.data.message);
                  setUiState('success');
                },
                () => {
                  setUiState('failure');
                },
              );
            }}>
            Save
          </Button>
        </View>
      </BottomSheetComponent>
      <LoadingModal visible={uiState === 'loading'} />
      <UpdateProfilePicModal
        modalVisible={isModalVis}
        setModalVisible={setIsModalVis}
        imgUrl={user?.profilePicture ?? ''}
        userName={user?.name ?? ''}
        viewImage={function () {
          setIsModalVis(false);
          navigation.getParent()?.navigate('IMAGE_VIEW', {
            imageUri: user?.profilePicture,
          });
        }}
      />
    </View>
  );
};

export default ProfileTab;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    heading: {
      fontSize: RFValue(18),
      color: theme.onSecondaryContainer,
      marginHorizontal: scale(16),
      marginVertical: verticalScale(18),
    },
    profilePic: {
      height: moderateScale(120),
      width: moderateScale(120),
      borderRadius: moderateScale(60),
      borderWidth: 3,
      borderColor: ColorAssets.blue500,
      alignSelf: 'center',
      resizeMode: 'cover',
    },
    section: {
      marginHorizontal: scale(24),
      marginVertical: verticalScale(16),
      alignItems: 'flex-start',
      gap: scale(8),
    },
    bottomSection: {
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(20),
      justifyContent: 'space-between',
      // marginTop: verticalScale(8),
    },
  });

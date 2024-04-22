import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Alert,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {
  FC,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import SimpleText from '../components/SimpleText';
import {RFValue} from 'react-native-responsive-fontsize';
import IconTextField, {
  IconTextFieldRefProps,
} from '../components/IconTextField';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {Button, Modal} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {initService, safeApiCall} from '../utils/axios_utils';
import {UiState, showToast, storeData} from '../utils/apputils';
import {Constant} from '../utils/constant';
import RippleButton from '../components/ripple_button';
import ColorAssets from '../theme/colors';
import LoadingModal from '../components/LoadingModal';
import IconTextField2 from '../components/IconTextField2';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LightTheme} from '../theme/light_theme';
import {RootStackParamsList} from '../navigation/params';
import {ImageAssets} from '../../assets';
import {login, validateEmail} from '../services/auth_services';
import {initService, safeApiCall} from '../utils/axios_utils';
import axios from 'axios';
import {LoginResponse} from '../models/LoginResponse';

type LoginScreenProps = NativeStackScreenProps<RootStackParamsList, 'LOGIN'>;

const {height, width} = Dimensions.get('window');

const Login: FC<LoginScreenProps> = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const emailRef = useRef<IconTextFieldRefProps>(null);
  const passwordRef = useRef<IconTextFieldRefProps>(null);
  const [uiState, setUiState] = useState<UiState>('idle');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleLogin = function () {
    if (uiState === 'loading') {
      return;
    }
    const email = emailRef.current!.getText();
    const password = passwordRef.current!.getText();
    console.log(email, password);
    if (email.trim().length === 0 || password.trim().length === 0) {
      showToast('Please enter all the details');
      return;
    }
    try {
      if (validateEmail(email) !== null) {
        showToast('Please enter valid email');
        return;
      }
    } catch (error) {
      showToast('Please enter valid email');
      return;
    }
    setUiState('loading');
    safeApiCall(
      async () => {
        const res = await login(email, password);
        await storeData(Constant.AUTH_TOKEN, res.data.result.accessToken!);
        await initService(res.data.result.accessToken!);
        setUiState('success');
        navigation.reset({routes: [{name: 'MAIN'}]});
      },
      () => {
        setUiState('idle');
      },
    );
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle={theme === LightTheme ? 'dark-content' : 'light-content'}
      />
      <ImageBackground
        source={ImageAssets.AuthBg}
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.backgroungColor,
        }}>
        <ScrollView
          contentContainerStyle={{
            minHeight: '100%',
            paddingHorizontal: scale(36),
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={{paddingTop: height * 0.25}}>
            <SimpleText fontWeight="bold" style={styles.heading}>
              {`Already,\nRegistered?`}
            </SimpleText>
            <IconTextField2
              title={'Email'}
              ref={emailRef as Ref<any>}
              securedText={false}
              validate={validateEmail}
              placeholder="Enter your email"
              allowSpaces={false}
              inputContainerStyle={{borderColor: '#E3E3E3'}}
              textInputProps={{
                autoCapitalize: 'none',
              }}
            />
            <IconTextField2
              title="Password"
              ref={passwordRef as Ref<any>}
              securedText={true}
              placeholder="Enter your password"
              inputContainerStyle={{borderColor: '#E3E3E3'}}
              endIcon="eye"
            />
          </View>
          {isKeyboardVisible ? null : <View style={{flex: 1}} />}
          <View
            style={{
              marginBottom: verticalScale(14),
              width: width,
              paddingHorizontal: scale(36),
              alignSelf: 'center',
            }}>
            <Button
              // mode="elevated"
              buttonColor={theme.blackInverse}
              textColor={theme.whiteInverse}
              labelStyle={{
                fontSize: RFValue(15),
                // fontFamily: 'Inter-regular',
                fontWeight: '400',
                includeFontPadding: false,
              }}
              style={{
                borderRadius: 10,
                marginTop: verticalScale(5),
                paddingVertical: verticalScale(4),
              }}
              onPress={() => {
                handleLogin();
                // goToOtpScreen();
              }}>
              Sign in
            </Button>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: verticalScale(10),
              }}>
              <SimpleText>Don't have an account?</SimpleText>
              <RippleButton
                style={{padding: moderateScale(5)}}
                onPress={() => {}}>
                <SimpleText fontWeight="bold">Register</SimpleText>
              </RippleButton>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <LoadingModal visible={uiState === 'loading'} />
    </>
  );
};

export default Login;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    heading: {
      alignSelf: 'flex-start',
      fontSize: RFValue(25),
      marginBottom: verticalScale(40),
    },
    bottomSheetContainer: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(12),
      gap: verticalScale(6),
    },
  });

import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useMemo} from 'react';
import SimpleText from '../components/SimpleText';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import {RFValue} from 'react-native-responsive-fontsize';
import {getData} from '../utils/apputils';
import {Constant} from '../utils/constant';
import {initService} from '../utils/axios_utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/params';
import {ImageAssets} from '../../assets';
import {moderateScale} from 'react-native-size-matters';
import {DarkTheme} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamsList, 'SPLASH'>;

const SplashScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);

  const checkUser = async () => {
    const accessToken = await getData(Constant.AUTH_TOKEN);
    await initService(accessToken);
    setTimeout(() => {
      if (accessToken === undefined) {
        navigation.replace('LOGIN');
      } else {
        navigation.replace('MAIN');
      }
    }, 1500);
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ImageBackground source={ImageAssets.AuthBg} style={styles.container}>
      <Image source={ImageAssets.Logo} style={styles.image} />
    </ImageBackground>
  );
};

export default SplashScreen;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroungColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: moderateScale(200),
      width: moderateScale(200),
      resizeMode: 'cover',
    },
  });

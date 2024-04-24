import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamsList} from './params';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import {ThemeContext} from '../contexts/theme_context';
import {LightTheme} from '../theme/light_theme';
import {getData, rootNavigationRef} from '../utils/apputils';
import {Constant} from '../utils/constant';
import LoginScreen from '../screens/LoginScreen';
import ChatScreen from '../screens/ChatScreen';
import MainScreen from '../screens/MainScreen';
import ImageView from '../screens/ImageView';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const Router = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  // const {isConnected} = useContext(NetInfoContext);
  // const snapPoints = useMemo(() => ['25%'], []);
  // const bottomSheetRef = useRef<BottomSheet>(null);
  // const backdrop = useCallback(
  //   (props: BottomSheetBackdropProps) => (
  //     <BottomSheetBackdrop
  //       appearsOnIndex={0}
  //       disappearsOnIndex={-1}
  //       pressBehavior={'none'}
  //       {...props}
  //     />
  //   ),
  //   [],
  // );
  const setTheme = async () => {
    const theme = await getData(Constant.THEME_DATA);
    if (theme && theme === 'dark_theme') {
      toggleTheme();
    }
  };

  useEffect(() => {
    setTheme();
    //   const unsubscribe = addEventListener(state => {
    //     if (state.isConnected) {
    //       setConnectionSts(true);
    //       bottomSheetRef.current?.close();
    //     } else {
    //       setConnectionSts(false);
    //       bottomSheetRef.current?.snapToIndex(0);
    //     }
    //   });
    //   return () => {
    //     unsubscribe();
    //   };
  }, []);
  return (
    <>
      <StatusBar
        backgroundColor={theme.surfaceVariant}
        barStyle={theme === LightTheme ? 'dark-content' : 'light-content'}
      />
      <NavigationContainer ref={rootNavigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
          initialRouteName="SPLASH">
          <Stack.Screen name="SPLASH" component={SplashScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="MAIN" component={MainScreen} />
          <Stack.Screen name="CHAT" component={ChatScreen} />
          <Stack.Screen name="IMAGE_VIEW" component={ImageView} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* <BottomSheet
        handleIndicatorStyle={{
          backgroundColor: theme.backgroungColor,
          width: 85,
        }}
        ref={bottomSheetRef}
        backdropComponent={backdrop}
        snapPoints={snapPoints}
        handleComponent={null}
        index={-1}>
        <View
          style={{paddingBottom: 0, padding: scale(16), alignItems: 'center'}}>
          <Image
            source={ImageAssets.noInternet}
            style={{resizeMode: 'contain', height: 100}}
          />
          <SimpleText
            style={{marginTop: verticalScale(16), fontSize: RFValue(16)}}
            fontWeight="semi-bold">
            No Internet Connection
          </SimpleText>
        </View>
      </BottomSheet> */}
    </>
  );
};

export default Router;

const styles = StyleSheet.create({});

import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../contexts/UserContext';
import {safeApiCall} from '../utils/axios_utils';
import {getMyProfile, saveFCMToken} from '../services/user_services';
import {UiState} from '../utils/apputils';
import SimpleText from '../components/SimpleText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomNavParamsList, RootStackParamsList} from '../navigation/params';
import LoadingComponent from '../components/LoadingComponent';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from '../contexts/theme_context';
import {verticalScale} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import HomeTab from './bottomNav/HomeTab';
import ProfileTab from './bottomNav/ProfileTab';
import {getMessaging} from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {Chat} from '../models/ChatResponse';

const Tab = createBottomTabNavigator<BottomNavParamsList>();

type Props = NativeStackScreenProps<RootStackParamsList, 'MAIN'>;

const MainScreen: React.FC<Props> = ({navigation}) => {
  const {user, loadUser} = useContext(UserContext);
  const [uiState, setUiState] = useState<UiState>('idle');
  const {theme} = useContext(ThemeContext);
  const {bottom} = useSafeAreaInsets();

  function fetchMyProfile() {
    setUiState('loading');
    safeApiCall(
      async () => {
        const res = await getMyProfile();
        loadUser(res.data.result.user);
        setUiState('success');
      },
      () => {
        setUiState('failure');
      },
    );
  }

  async function requrestPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function onAppBootstrap() {
    // Request permission
    const granted = await requrestPermission();

    if (granted) {
      safeApiCall(async () => {
        // Register the device with FCM
        await getMessaging().registerDeviceForRemoteMessages();

        // Get the token
        const token = await messaging().getToken();
        console.log('fcmtoken', token);

        // Save the token
        const res = await saveFCMToken(token);
        console.log(res.data.message);

        // Listen for notifications
        bootstrap();
      });
    }
  }

  async function bootstrap() {
    // handling notification press when the app is in the background (closed state)
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification && initialNotification?.notification?.data) {
      const chat = initialNotification?.notification?.data?.chat as string;
      if (chat) {
        navigation.navigate('CHAT', {
          chat: JSON.parse(chat) as Chat,
        });
      }
    }
  }

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    if (user) onAppBootstrap();
  }, [user]);

  useEffect(() => {
    // handling notification press when the app is in the foreground (opened state)
    return notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        const chat = detail?.notification?.data?.chat as string;
        if (chat) {
          navigation.navigate('CHAT', {
            chat: JSON.parse(chat) as Chat,
          });
        }
      }
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme.backgroungColor}}>
      {uiState === 'loading' ? (
        <LoadingComponent />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: true,
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarLabelPosition: 'below-icon',
            tabBarActiveTintColor: theme.onPrimaryContainer,
            tabBarInactiveTintColor: theme.secondaryColor,
            tabBarStyle: {
              // paddingBottom: bottom === 0 ? verticalScale(6) : bottom,
              paddingBottom: Platform.OS === 'ios' ? 0 : verticalScale(8),
              height:
                Platform.OS === 'ios' ? verticalScale(70) : verticalScale(50),
              paddingTop: verticalScale(6),
              backgroundColor: theme.whiteInverse,
              borderTopWidth: 0.5,
              borderColor: theme.onSecondary,
            },
          }}
          initialRouteName="HOME">
          <Tab.Screen
            name="HOME"
            component={HomeTab}
            options={{
              tabBarLabel: ({focused}) => (
                <SimpleText
                  fontWeight={focused ? 'bold' : 'medium'}
                  style={{
                    fontSize: RFValue(9),
                    color: focused
                      ? theme.onPrimaryContainer
                      : theme.secondaryColor,
                  }}>
                  Home
                </SimpleText>
              ),
              tabBarIcon: ({focused}) => {
                return (
                  <Feather
                    name="home"
                    size={RFValue(16)}
                    style={{marginBottom: 0}}
                    color={
                      focused ? theme.onPrimaryContainer : theme.secondaryColor
                    }
                  />
                );
              },
            }}
          />
          <Tab.Screen
            name="PROFILE"
            component={ProfileTab}
            options={{
              tabBarLabel: ({focused}) => (
                <SimpleText
                  fontWeight={focused ? 'bold' : 'medium'}
                  style={{
                    fontSize: RFValue(9),
                    color: focused
                      ? theme.onPrimaryContainer
                      : theme.secondaryColor,
                  }}>
                  Profile
                </SimpleText>
              ),
              tabBarIcon: ({focused}) => {
                return (
                  <Feather
                    name="user"
                    size={RFValue(16)}
                    style={{marginBottom: 0}}
                    color={
                      focused ? theme.onPrimaryContainer : theme.secondaryColor
                    }
                  />
                );
              },
            }}
          />
        </Tab.Navigator>
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});

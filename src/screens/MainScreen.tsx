import {Platform, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../contexts/UserContext';
import {safeApiCall} from '../utils/axios_utils';
import {getMyProfile} from '../services/user_services';
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

  useEffect(() => {
    fetchMyProfile();
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

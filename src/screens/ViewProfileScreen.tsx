import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useMemo} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/params';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import SimpleText from '../components/SimpleText';
import {RFValue} from 'react-native-responsive-fontsize';
import Divider from '../components/Divider';
import {gs} from '../theme/global_styles';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import ColorAssets from '../theme/colors';
import {Appbar} from 'react-native-paper';

type Props = NativeStackScreenProps<RootStackParamsList, 'VIEW_PROFILE'>;

const ViewProfileScreen: React.FC<Props> = ({navigation, route}) => {
  const {user} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={function () {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="User Profile" />
      </Appbar.Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: verticalScale(30),
        }}>
        <Pressable
          onPress={function () {
            navigation.navigate('IMAGE_VIEW', {imageUri: user.profilePicture});
          }}>
          <Image
            source={{uri: user.profilePicture}}
            style={styles.profilePic}
          />
        </Pressable>

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
              {user.name}
            </SimpleText>
            <SimpleText
              style={{color: theme.secondaryContainer, fontSize: RFValue(10)}}>
              Name
            </SimpleText>
          </View>
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
              {user.email}
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
              {moment(user.createdAt).format('MMM D, YYYY [at] h:mm a')}
            </SimpleText>
            <SimpleText
              style={{color: theme.secondaryContainer, fontSize: RFValue(10)}}>
              Joined on
            </SimpleText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewProfileScreen;

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
  });

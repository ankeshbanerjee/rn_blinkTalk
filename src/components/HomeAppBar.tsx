import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {RFValue} from 'react-native-responsive-fontsize';
import SimpleText from './SimpleText';
import Logo from '../../assets/svg/Logo';
import {gs} from '../theme/global_styles';
import {ThemeContext} from '../contexts/theme_context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ColorAssets from '../theme/colors';

const HomeAppBar: React.FC = () => {
  const {theme} = useContext(ThemeContext);
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        gs.row,
        {
          backgroundColor: theme.backgroungColor,
          gap: 8,
          paddingHorizontal: scale(16),
          paddingTop:
            top + Platform.OS === 'ios' ? verticalScale(6) : verticalScale(12),
          paddingBottom: verticalScale(10),
          shadowColor: ColorAssets.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}>
      <Logo width={40} height={40} />
      <SimpleText
        color={theme.primaryColor}
        fontWeight="bold"
        size={RFValue(18)}>
        BlinkTalk
      </SimpleText>
    </View>
  );
};

export default HomeAppBar;

import {View} from 'react-native';
import React, {useContext} from 'react';
import {verticalScale} from 'react-native-size-matters';
import {ThemeContext} from '../contexts/theme_context';

const Divider: React.FC = () => {
  const {theme} = useContext(ThemeContext);
  return (
    <View
      style={{
        width: '100%',
        height: verticalScale(1),
        backgroundColor: theme.onSecondary,
      }}
    />
  );
};

export default Divider;

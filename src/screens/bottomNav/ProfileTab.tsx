import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useMemo} from 'react';
import SimpleText from '../../components/SimpleText';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomNavParamsList} from '../../navigation/params';
import {ThemeContext} from '../../contexts/theme_context';
import {ThemeData} from '../../theme/theme_data';

type Props = BottomTabScreenProps<BottomNavParamsList, 'PROFILE'>;

const ProfileTab: React.FC<Props> = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <SimpleText>Profile</SimpleText>
      </View>
    </SafeAreaView>
  );
};

export default ProfileTab;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroungColor,
    },
  });

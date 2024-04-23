import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {FC, useContext} from 'react';
import SimpleText from './SimpleText';
import {Button} from 'react-native-paper';
import {ThemeData} from '../theme/theme_data';
import {ThemeContext} from '../contexts/theme_context';

const LoadingComponent: FC = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color={theme.primaryColor} size={'large'} />
    </SafeAreaView>
  );
};

export default LoadingComponent;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: theme.backgroungColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

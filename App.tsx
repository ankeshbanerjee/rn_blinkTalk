import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeContextProvider} from './src/contexts/theme_context';
import SimpleText from './src/components/SimpleText';
import Router from './src/navigation/Router';
import {UserContextProvider} from './src/contexts/UserContext';

const App = () => {
  return (
    <>
      <UserContextProvider>
        <ThemeContextProvider>
          <Router />
        </ThemeContextProvider>
      </UserContextProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});

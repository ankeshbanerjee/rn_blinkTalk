import React from 'react';
import {ThemeContextProvider} from './src/contexts/theme_context';
import Router from './src/navigation/Router';
import {UserContextProvider} from './src/contexts/UserContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <UserContextProvider>
          <ThemeContextProvider>
            <BottomSheetModalProvider>
              <Router />
            </BottomSheetModalProvider>
          </ThemeContextProvider>
        </UserContextProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;

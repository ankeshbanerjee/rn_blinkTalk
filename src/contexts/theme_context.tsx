import {createContext, FC, PropsWithChildren, useState} from 'react';
import {ThemeData} from '../theme/theme_data';
import {LightTheme} from '../theme/light_theme';
import {PaperProvider} from 'react-native-paper';
import {DarkTheme} from '../theme/dark_theme';

type ThemeContextType = {
  theme: ThemeData;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);

export const ThemeContextProvider: FC<PropsWithChildren> = ({children}) => {
  const [theme, toggleTheme] = useState<ThemeData>(LightTheme);

  const changeTheme = () => {
    if (theme.isDark === false) {
      toggleTheme(DarkTheme);
    } else {
      toggleTheme(LightTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{theme: theme, toggleTheme: changeTheme}}>
      <PaperProvider theme={theme.paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

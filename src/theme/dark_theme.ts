import {MD3DarkTheme} from 'react-native-paper';
import {ThemeData} from './theme_data';
import {LightTheme} from './light_theme';
import ColorAssets from './colors';

export const DarkTheme: ThemeData = {
  isDark: true,
  paperTheme: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: ColorAssets.blue600,
      secondary: ColorAssets.gray500,
      tertiary: ColorAssets.emerald500,
    },
  },
  primaryColor: ColorAssets.blue600,
  primaryContainer: ColorAssets.blue400,
  onPrimaryContainer: ColorAssets.blue600,
  onPrimary: ColorAssets.blue200,
  secondaryColor: ColorAssets.gray300,
  secondaryContainer: ColorAssets.gray400,
  onSecondaryContainer: ColorAssets.gray200,
  onSecondary: ColorAssets.gray700,
  tertiaryColor: ColorAssets.emerald500,
  tertiaryContainer: ColorAssets.emerald200,
  backgroungColor: ColorAssets.gray900,
  surfaceVariant: ColorAssets.gray800,
  onSurfaceVariant: ColorAssets.gray600,
  shadowColor: ColorAssets.black,
  disabledBtnColor: ColorAssets.gray600,
  whiteInverse: ColorAssets.black,
  blackInverse: ColorAssets.white,
};

import {MD3LightTheme} from 'react-native-paper';
import {ThemeData} from './theme_data';
import ColorAssets from './colors';

export const LightTheme: ThemeData = {
  paperTheme: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: ColorAssets.blue600,
      secondary: ColorAssets.gray500,
      tertiary: ColorAssets.emerald500,
    },
  },
  primaryColor: ColorAssets.blue600,
  primaryContainer: ColorAssets.blue400,
  onPrimaryContainer: ColorAssets.blue700,
  onPrimary: ColorAssets.blue200,
  secondaryColor: ColorAssets.gray500,
  secondaryContainer: ColorAssets.gray400,
  onSecondaryContainer: ColorAssets.gray700,
  onSecondary: ColorAssets.gray200,
  tertiaryColor: ColorAssets.emerald500,
  tertiaryContainer: ColorAssets.emerald200,
  backgroungColor: ColorAssets.gray100,
  surfaceVariant: ColorAssets.white,
  onSurfaceVariant: ColorAssets.gray300,
  shadowColor: ColorAssets.dropShadowLight,
  disabledBtnColor: ColorAssets.gray300,
  whiteInverse: ColorAssets.white,
  blackInverse: ColorAssets.black,
};

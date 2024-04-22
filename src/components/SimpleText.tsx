import React, {PropsWithChildren, useContext} from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import COLORS from '../theme/colors';
import {ThemeContext} from '../contexts/theme_context';

type Props = {
  style?: StyleProp<TextStyle>;
  fontWeight?:
    | 'black'
    | 'bold'
    | 'semi-bold'
    | 'extra-bold'
    | 'light'
    | 'extra-light'
    | 'medium'
    | 'regular'
    | 'thin'
    | 'variable';
  textProps?: TextProps;
  size?: number;
  color?: string;
};

const SimpleText: React.FC<PropsWithChildren<Props>> = ({
  style,
  fontWeight,
  textProps,
  children,
  color,
  size,
}) => {
  let textStyle: {};
  switch (fontWeight) {
    case 'black':
      textStyle = styles.black;
      break;
    case 'bold':
      textStyle = styles.bold;
      break;
    case 'semi-bold':
      textStyle = styles.semiBold;
      break;
    case 'extra-bold':
      textStyle = styles.extraBold;
      break;
    case 'light':
      textStyle = styles.light;
      break;

    case 'extra-light':
      textStyle = styles.extraLight;
      break;
    case 'medium':
      textStyle = styles.medium;
      break;
    case 'regular':
      textStyle = styles.regular;
      break;

    case 'variable':
      textStyle = styles.variable;
      break;

    default:
      textStyle = styles.regular;
      break;
  }

  const {theme} = useContext(ThemeContext);

  const passedStyles: StyleProp<TextStyle> = [
    {
      color: color ?? theme.blackInverse,
      fontSize: size ?? 14,
      includeFontPadding: false,
    },
    style,
  ];

  return (
    <Text style={[textStyle, passedStyles]} {...textProps}>
      {children}
    </Text>
  );
};

export default SimpleText;

const styles = StyleSheet.create({
  black: {
    fontFamily: 'Inter-Black',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold',
  },
  extraBold: {
    fontFamily: 'Inter-ExtraBold',
  },
  light: {
    fontFamily: 'Inter-Light',
  },
  extraLight: {
    fontFamily: 'Inter-ExtraLight',
  },

  regular: {
    fontFamily: 'Inter-Regular',
  },

  medium: {fontFamily: 'Inter-Medium'},

  variable: {
    fontFamily: 'Inter-Variable_sInt,wght',
  },
});

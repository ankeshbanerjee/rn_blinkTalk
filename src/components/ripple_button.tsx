import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
  } from 'react-native';
  import React, {FC, PropsWithChildren} from 'react';
  
  type Props = {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    props?: PressableProps;
    rippleColor?: string;
  };
  
  const RippleButton: FC<PropsWithChildren<Props>> = ({
    children,
    style,
    onPress,
    props,
    rippleColor,
  }) => {
    if (rippleColor === undefined) {
      if (
        style !== undefined &&
        StyleSheet.flatten(style).backgroundColor !== undefined &&
        StyleSheet.flatten(style).backgroundColor?.toString().length === 7
      ) {
        rippleColor = `${StyleSheet.flatten(style).backgroundColor?.toString}43`;
      } else {
        rippleColor = '#0000001a';
      }
    }
    return (
      <View
        style={[
          style,
          {
            padding: 0,
            paddingLeft: 0,
            paddingStart: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingEnd: 0,
            paddingBottom: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
            overflow: 'hidden',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            flexDirection: 'column',
          },
        ]}>
        <Pressable
          android_ripple={{
            color: rippleColor,
          }}
          style={{
            padding: StyleSheet.flatten(style)?.padding,
            paddingLeft: StyleSheet.flatten(style)?.paddingLeft,
            paddingStart: StyleSheet.flatten(style)?.paddingStart,
            paddingTop: StyleSheet.flatten(style)?.paddingTop,
            paddingRight: StyleSheet.flatten(style)?.paddingRight,
            paddingEnd: StyleSheet.flatten(style)?.paddingEnd,
            paddingBottom: StyleSheet.flatten(style)?.paddingBottom,
            paddingHorizontal: StyleSheet.flatten(style)?.paddingHorizontal,
            paddingVertical: StyleSheet.flatten(style)?.paddingVertical,
            alignItems: StyleSheet.flatten(style)?.alignItems,
            justifyContent: StyleSheet.flatten(style)?.justifyContent,
            flexDirection: StyleSheet.flatten(style)?.flexDirection,
          }}
          onPress={onPress}
          {...props}>
          {children}
        </Pressable>
      </View>
    );
  };
  
  export default RippleButton;
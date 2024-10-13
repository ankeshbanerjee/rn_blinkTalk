import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import React, {PropsWithChildren} from 'react';

interface Props {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function RippleButton({
  style,
  onPress,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Pressable
      android_ripple={{
        color: 'rgba(0, 0, 0, 0.1)',
        borderless: false,
        foreground: true,
      }}
      onPress={onPress ?? (() => {})}
      style={[style, {overflow: 'hidden'}]}>
      {children}
    </Pressable>
  );
}

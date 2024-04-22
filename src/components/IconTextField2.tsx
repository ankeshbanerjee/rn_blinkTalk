import React, {
  FC,
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../contexts/theme_context';
import RippleButton from './ripple_button';
import {ThemeData} from '../theme/theme_data';
import ColorAssets from '../theme/colors';
import SimpleText from './SimpleText';
import {RFValue} from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import {verticalScale} from 'react-native-size-matters';

interface IconTextFieldProps {
  title: string;
  icon?: string;
  securedText?: boolean;
  placeholder: string;
  validate?: (text: string) => string | null;
  endIcon?: string;
  viewRef?: Ref<TextInput>;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  showError?: boolean;
  textInputProps?: TextInputProps;
  initialValue?: string;
  enabled?: boolean;
  leadingText?: string;
  allowSpaces?: boolean;
}

export interface IconTextFieldRefProps {
  getText: () => string;
  setValue: (val: string) => void;
}

const IconTextField2 = React.forwardRef<
  IconTextFieldRefProps,
  IconTextFieldProps
>(
  (
    {
      title,
      icon,
      securedText = false,
      placeholder,
      validate,
      viewRef = useRef<TextInput>(),
      style,
      containerStyle,
      inputContainerStyle,
      showError = true,
      endIcon,
      textInputProps,
      initialValue,
      leadingText,
      allowSpaces = true,
    },
    ref,
  ) => {
    const [isFocused, setFocus] = useState(false);
    const [isSecured, setSecured] = useState(securedText);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState<string>(initialValue ?? '');

    const {theme} = useContext(ThemeContext);

    const textRef = useRef<TextInput>();

    const styles = getStyles(theme);

    const getText = () => text;

    const setValue = (val: string) => {
      setText(val);
    };

    useImperativeHandle(ref, () => ({getText, setValue}), [getText, setValue]);

    const handlevalidation = (t: string) => {
      const errMsg = validate!(t);
      if (errMsg !== null) {
        setError(errMsg);
      } else if (errMsg === null && error !== null) {
        setError(null);
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.innerContainer}>
          <View style={{flex: 1}}>
            <SimpleText
              fontWeight="medium"
              style={{
                color: theme.secondaryColor,
                marginBottom: 2,
                fontSize: RFValue(10),
              }}>
              {title.toUpperCase() + ':'}
            </SimpleText>
            <View
              style={[
                {
                  ...styles.textContainer,
                  // borderColor: isFocused ? theme.primaryColor : 'black',
                  // elevation: isFocused ? 8 : undefined,
                  // borderWidth: isFocused ? 1 : 0.5,
                  // paddingHorizontal: icon === undefined ? 5 : 14,
                  backgroundColor: 'transparent',
                },
                inputContainerStyle,
              ]}>
              {icon !== undefined && (
                <MaterialCommunityIcon
                  name={icon}
                  color={isFocused ? theme.primaryColor : theme.blackInverse}
                  size={20}
                  style={styles.iconStyle}
                />
              )}
              {leadingText !== undefined ? (
                <View>
                  <SimpleText fontWeight="medium" style={{marginRight: 6}}>
                    {leadingText}
                  </SimpleText>
                </View>
              ) : null}
              <TextInput
                secureTextEntry={isSecured}
                placeholder={placeholder}
                placeholderTextColor={theme.secondaryColor}
                style={[styles.inputStyle, style]}
                disableFullscreenUI={false}
                {...textInputProps}
                onEndEditing={e => {
                  setFocus(!isFocused);
                }}
                value={text}
                onChangeText={t => {
                  if (textInputProps?.onChangeText !== undefined) {
                    textInputProps.onChangeText(text);
                  }
                  if (allowSpaces) {
                    setText(t);
                  } else {
                    setText(t.replace(/\s/g, ''));
                  }
                  // if (validate !== undefined) handlevalidation(t);
                }}
                ref={viewRef as Ref<any>}
                onBlur={() => {
                  if (validate !== undefined && text.trim().length !== 0)
                    handlevalidation(text);
                }}
                // blurOnSubmit={securedText ? undefined : false}
                blurOnSubmit={true}
                onFocus={e => {
                  if (textInputProps?.onFocus !== undefined) {
                    textInputProps.onFocus(e);
                  }
                  setFocus(!isFocused);
                  setError(null);
                }}
              />
            </View>
          </View>
          {!securedText && validate && validate(text) === null ? (
            <Feather name="check-circle" size={16} color={theme.blackInverse} />
          ) : null}
          {securedText && endIcon !== undefined && (
            <RippleButton
              onPress={() => {
                setSecured(!isSecured);
              }}>
              <Feather
                name={isSecured ? 'eye-off' : 'eye'}
                // color={isFocused ? theme.primaryColor : ColorAssets.black}
                color={theme.blackInverse}
                size={16}
                style={styles.iconStyle}
              />
            </RippleButton>
          )}
        </View>
        {(error != null && showError === true) === true ? (
          <Text
            style={{
              fontSize: 15,
              color: 'red',
              marginTop: 2,
              position: 'absolute',
              bottom: -verticalScale(16),
            }}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

export default IconTextField2;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      marginBottom:
        Platform.OS === 'ios' ? verticalScale(10) : verticalScale(18),
      minHeight: 50,
    },
    innerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.onSecondaryContainer,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // paddingHorizontal: 20,
      // backgroundColor: 'whitesmoke',
      // borderRadius: 10,
      // shadowColor: theme.primaryColor,
      // shadowRadius: 10,
      // minHeight: 50,
      // flex: 1,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStyle: {
      color: theme.blackInverse,
      flex: 1,
      padding: Platform.OS === 'android' ? 0 : undefined,
      fontFamily: 'Poppins-Regular',
    },

    lableStyle: {
      fontSize: 20,
      color: 'black',
    },
  });

import React, {
  FC,
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
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
import RippleButton from './RippleButton';
import {ThemeData} from '../theme/theme_data';
import ColorAssets from '../theme/colors';
import SimpleText from './SimpleText';

interface IconTextFieldProps {
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
  endText?: string;
  endAction?: () => void;
}

export interface IconTextFieldRefProps {
  getText: () => string;
  setValue: (val: string) => void;
}

const IconTextField = React.forwardRef<
  IconTextFieldRefProps,
  IconTextFieldProps
>(
  (
    {
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
      endText,
      endAction,
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

    useImperativeHandle(ref, () => ({getText, setValue}), [
      getText,
      setValue,
      text,
      setText,
    ]);

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
        <View
          style={[
            {
              ...styles.textContainer,
              // borderColor: isFocused ? theme.primaryColor : 'black',
              borderColor: theme.blackInverse,
              elevation: isFocused ? 8 : undefined,
              borderWidth: isFocused ? 1 : 0.5,
              paddingHorizontal: icon === undefined ? 5 : 14,
              // backgroundColor: isFocused ? ColorAssets.white : '#FAFAFA',
              backgroundColor: theme.backgroungColor,
            },
            inputContainerStyle,
          ]}>
          {icon !== undefined && (
            <MaterialCommunityIcon
              name={icon}
              color={isFocused ? theme.primaryColor : theme.secondaryColor}
              size={20}
              style={styles.iconStyle}
            />
          )}
          {leadingText !== undefined ? (
            <View>
              <SimpleText fontWeight="medium">{leadingText}</SimpleText>
            </View>
          ) : null}
          <TextInput
            secureTextEntry={isSecured}
            placeholder={placeholder}
            placeholderTextColor="grey"
            style={[styles.inputStyle, {color: theme.blackInverse}, style]}
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
              if (validate !== undefined) handlevalidation(t);
            }}
            ref={viewRef as Ref<any>}
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

          {securedText && endIcon !== undefined && (
            <RippleButton
              onPress={() => {
                setSecured(!isSecured);
              }}>
              <MaterialCommunityIcon
                name={isSecured ? 'eye-off' : 'eye'}
                color={isFocused ? theme.primaryColor : ColorAssets.black}
                size={20}
                style={styles.iconStyle}
              />
            </RippleButton>
          )}

          {endText && (
            <SimpleText
              textProps={{onPress: endAction}}
              fontWeight="semi-bold"
              style={{marginHorizontal: 6}}>
              {endText}
            </SimpleText>
          )}
        </View>
        {(error != null && showError === true) === true ? (
          <Text style={{fontSize: 15, color: 'red', marginTop: 2}}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

export default IconTextField;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      marginBottom: 14,
      minHeight: 50,
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'whitesmoke',
      borderRadius: 10,
      shadowColor: theme.primaryColor,
      shadowRadius: 10,
      minHeight: 50,
      flex: 1,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStyle: {
      color: 'black',
      marginStart: 10,
      flex: 1,
      fontFamily: 'Poppins-Regular',
    },

    lableStyle: {
      fontSize: 20,
      color: 'black',
    },
  });

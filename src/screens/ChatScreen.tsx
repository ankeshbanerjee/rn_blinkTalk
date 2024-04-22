import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {
  Ref,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  version,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/params';
import socket from '../utils/socket';
import {UserContext} from '../contexts/UserContext';
import axios from 'axios';
import {gs} from '../theme/global_styles';
import {ImageAssets} from '../../assets';
import {Image} from 'react-native';
import SimpleText from '../components/SimpleText';
import {RFValue} from 'react-native-responsive-fontsize';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconTextField, {
  IconTextFieldRefProps,
} from '../components/IconTextField';
import {LightTheme} from '../theme/light_theme';
import RippleButton from '../components/ripple_button';
import IcSend from '../../assets/svg/IcSend';
import {safeApiCall} from '../utils/axios_utils';
import {createMessage, fetchMessages} from '../services/message_services';
import {Message} from '../models/MessageResponse';
import {showToast, UiState} from '../utils/apputils';
import ColorAssets from '../theme/colors';
import moment from 'moment';
import LoadingComponent from '../components/LoadingComponent';

type Props = NativeStackScreenProps<RootStackParamsList, 'CHAT'>;

const ChatScreen: React.FC<Props> = ({navigation, route}) => {
  const {chat} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const {top, bottom} = useSafeAreaInsets();
  const {user} = useContext(UserContext);
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const msgRef = useRef<IconTextFieldRefProps>(null);
  const [uiState, setUiState] = useState<UiState>('idle');
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    const msgTxt = msgRef.current?.getText();
    if (!msgTxt || msgTxt.trim().length === 0) {
      showToast('Please enter a valid message');
      return;
    }
    safeApiCall(async () => {
      const res = await createMessage(chat._id, msgTxt);
      socket.emit('message', JSON.stringify(res.data.result.message));
      msgRef.current?.setValue('');
    });
  };

  useEffect(() => {
    const getMessages = () => {
      setUiState('loading');
      safeApiCall(
        async () => {
          const res = await fetchMessages(chat._id);
          setMessages(res.data.result.messages.reverse());
          socket.emit('join room', chat._id);
          setUiState('success');
        },
        () => {
          setUiState('failure');
        },
      );
    };
    getMessages();
  }, []);

  useEffect(() => {
    socket.on('message', message => {
      console.log(JSON.parse(message).content);
      setMessages(p => [JSON.parse(message), ...p]);
    });
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on('stop typing', msg => setIsTyping(false));

    return () => {
      socket.off('message');
    };
  }, [socket]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, [messages]);

  return (
    <View style={styles.container}>
      <View
        style={[
          gs.row,
          {
            paddingTop: top,
            paddingHorizontal: scale(10),
            paddingBottom: verticalScale(10),
            backgroundColor: theme.surfaceVariant,
          },
        ]}>
        <Entypo
          name="chevron-left"
          color={theme.blackInverse}
          size={RFValue(24)}
          style={{marginRight: scale(8)}}
          onPress={function () {
            navigation.goBack();
          }}
        />
        {chat.isGroupChat ? (
          <Image source={ImageAssets.Group} style={styles.profileImage} />
        ) : (
          <Image
            source={{
              uri: chat.users.find(it => it._id !== user?._id)?.profilePicture,
            }}
            style={styles.profileImage}
          />
        )}
        <SimpleText
          color={theme.secondaryColor}
          fontWeight="medium"
          size={RFValue(14)}
          style={{marginLeft: scale(10)}}>
          {chat.isGroupChat
            ? chat.chatName
            : chat.users.find(it => it._id !== user?._id)?.name}
        </SimpleText>
        <SimpleText>{isTyping ? 'Typing...' : ''}</SimpleText>
      </View>
      {uiState === 'loading' ? (
        <LoadingComponent />
      ) : (
        <FlatList
          inverted
          ref={flatListRef}
          data={messages}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: scale(10),
            paddingTop: verticalScale(10),
          }}
          renderItem={({item, index}) => {
            const senderType = item.sender._id === user?._id ? 'me' : 'others';
            return (
              <View
                style={
                  senderType === 'me'
                    ? styles.sendChatContainer
                    : styles.receiveChatContainer
                }>
                {chat.isGroupChat && senderType !== 'me' && (
                  <SimpleText
                    size={RFValue(10)}
                    color={theme.primaryColor}
                    fontWeight="bold"
                    style={{top: -4}}>
                    {item.sender.name}
                  </SimpleText>
                )}
                <SimpleText
                  style={{
                    fontSize: RFValue(12),
                    color: ColorAssets.black,
                    marginBottom: 4,
                  }}>
                  {item.content}
                </SimpleText>
                <SimpleText
                  style={{
                    fontSize: RFValue(8),
                    color: '#9CA3AF',
                    alignSelf: 'flex-end',
                    right: scale(-2),
                    bottom: verticalScale(-2),
                  }}
                  fontWeight="thin">
                  {moment(item.createdAt).format('h:mm a')}
                </SimpleText>
              </View>
            );
          }}
        />
      )}
      <View
        style={[
          gs.row,
          {
            paddingBottom: bottom,
            paddingHorizontal: scale(16),
            marginTop: verticalScale(4),
          },
        ]}>
        <IconTextField
          ref={msgRef as Ref<any>}
          placeholder={'Type your message'}
          containerStyle={styles.input}
          textInputProps={{
            onChangeText: function () {
              socket.emit('typing', chat._id);
              let lastTypingTime = new Date().getTime();
              var timerLength = 1000;
              setTimeout(() => {
                var timeNow = new Date().getTime();
                var timeDiff = timeNow - lastTypingTime;
                if (timeDiff >= timerLength) {
                  socket.emit('stop typing', chat._id);
                }
              }, timerLength);
            },
          }}
          inputContainerStyle={{
            backgroundColor:
              theme === LightTheme ? '#F3F4F6' : theme.surfaceVariant,
          }}
        />
        <RippleButton style={{marginEnd: 10}}>
          <MaterialCommunityIcons
            name="attachment"
            size={30}
            style={{color: '#B2B2B2'}}
          />
        </RippleButton>
        <Pressable onPress={handleSendMessage}>
          <IcSend />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatScreen;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroungColor,
    },
    profileImage: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(20),
      resizeMode: 'contain',
    },
    input: {
      flex: 1,
      backgroundColor: theme.backgroungColor,
      borderRadius: 10,
      marginEnd: 10,
      marginBottom: 0,
      color: theme.blackInverse,
    },
    sendChatContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(10),
      maxWidth: '80%',
      borderBottomEndRadius: scale(16),
      borderBottomStartRadius: scale(16),
      borderTopStartRadius: scale(16),
      marginTop: verticalScale(12),
      backgroundColor: '#DBEAFE',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
    },
    receiveChatContainer: {
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(10),
      maxWidth: '80%',
      borderBottomEndRadius: scale(16),
      borderBottomStartRadius: scale(16),
      borderTopEndRadius: scale(16),
      marginTop: verticalScale(12),
      backgroundColor: ColorAssets.white,
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
    },
  });

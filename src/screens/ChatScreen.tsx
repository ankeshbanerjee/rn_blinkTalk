import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {
  Ref,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/params';
import socket from '../utils/socket';
import {UserContext} from '../contexts/UserContext';
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
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.off('message');
    };
  }, [socket]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={[gs.row, styles.appBar, {paddingTop: top}]}>
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
        <View
          style={{
            marginLeft: scale(10),
            justifyContent: 'center',
          }}>
          <SimpleText
            color={theme.secondaryColor}
            fontWeight="medium"
            size={RFValue(14)}>
            {chat.isGroupChat
              ? chat.chatName
              : chat.users.find(it => it._id !== user?._id)?.name}
          </SimpleText>
          {isTyping ? (
            <SimpleText size={RFValue(10)}>
              {chat.isGroupChat ? 'someone is typing...' : 'typing...'}
            </SimpleText>
          ) : null}
        </View>
      </View>
      <ImageBackground
        source={ImageAssets.ChatBg}
        imageStyle={{opacity: 0.2}}
        style={{flex: 1, backgroundColor: theme.backgroungColor}}>
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
              const senderType =
                item.sender._id === user?._id ? 'me' : 'others';
              return (
                <>
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
                        color:
                          senderType === 'me'
                            ? ColorAssets.white
                            : theme.blackInverse,
                        marginBottom: 4,
                      }}>
                      {item.content}
                      {Platform.OS === 'ios'
                        ? '              \u00a0'
                        : '           \u00a0'}
                    </SimpleText>
                    <SimpleText
                      style={{
                        fontSize: RFValue(8),
                        color:
                          senderType === 'me'
                            ? ColorAssets.gray200
                            : theme.secondaryColor,
                        alignSelf: 'flex-end',
                      }}
                      fontWeight="thin">
                      {moment(item.createdAt).format('h:mm a')}
                    </SimpleText>
                  </View>
                  {index === messages.length - 1 ||
                  new Date(
                    messages[index + 1].createdAt,
                  ).toLocaleDateString() !==
                    new Date(item.createdAt).toLocaleDateString() ? (
                    <View style={styles.dateContainer}>
                      <SimpleText
                        style={{
                          fontSize: RFValue(10),
                          color: ColorAssets.black,
                        }}>
                        {moment(item.createdAt).format('dddd, Do MMM, YYYY')}
                      </SimpleText>
                    </View>
                  ) : null}
                </>
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
                let lastTypedAt = new Date().getTime();
                var delay = 1000;
                setTimeout(() => {
                  var timeNow = new Date().getTime();
                  var timeDiff = timeNow - lastTypedAt;
                  if (timeDiff >= delay) {
                    socket.emit('stop typing', chat._id);
                  }
                }, delay);
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
              style={{color: theme.onSecondaryContainer}}
            />
          </RippleButton>
          <Pressable style={styles.sendBtn} onPress={handleSendMessage}>
            <IcSend />
          </Pressable>
        </View>
      </ImageBackground>
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
    appBar: {
      paddingHorizontal: scale(10),
      paddingBottom: verticalScale(10),
      backgroundColor: theme.surfaceVariant,
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
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(6),
      maxWidth: '80%',
      borderBottomEndRadius: 12,
      borderBottomStartRadius: 12,
      borderTopStartRadius: 12,
      marginTop: verticalScale(12),
      // backgroundColor: '#DBEAFE',
      backgroundColor: '#047AFD',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
    },
    receiveChatContainer: {
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(6),
      maxWidth: '80%',
      borderBottomEndRadius: 12,
      borderBottomStartRadius: 12,
      borderTopEndRadius: 12,
      marginTop: verticalScale(12),
      // backgroundColor: ColorAssets.white,
      backgroundColor: theme.onSurfaceVariant,
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
    },
    dateContainer: {
      alignSelf: 'center',
      backgroundColor: theme.surfaceVariant,
      paddingVertical: moderateScale(6),
      paddingHorizontal: scale(10),
      borderRadius: 6,
      marginBottom: verticalScale(6),
      marginTop: verticalScale(20),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sendBtn: {
      height: 48,
      width: 48,
      borderRadius: 24,
      backgroundColor: theme.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

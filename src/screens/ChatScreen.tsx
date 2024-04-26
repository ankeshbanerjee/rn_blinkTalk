import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {
  Ref,
  useCallback,
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
import RippleButton from '../components/ripple_button';
import IcSend from '../../assets/svg/IcSend';
import {safeApiCall} from '../utils/axios_utils';
import {createMessage, fetchMessages} from '../services/message_services';
import {Message} from '../models/MessageResponse';
import {
  get_url_extension,
  isImageUrl,
  isVideoUrl,
  showToast,
  UiState,
} from '../utils/apputils';
import ColorAssets from '../theme/colors';
import moment from 'moment';
import LoadingComponent from '../components/LoadingComponent';
import DocumentPicker from 'react-native-document-picker';
import {uploadSingleFile} from '../services/upload_service';
import LoadingModal from '../components/LoadingModal';
import handleDownloadAndView from '../services/download_and_view';
import {User} from '../models/UserResponse';
import {useFocusEffect} from '@react-navigation/native';

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
  interface File {
    name: string;
    type: string;
    url: string;
  }
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = () => {
    const msgTxt = msgRef.current?.getText();
    if (!uploadedFile) {
      if (!msgTxt || msgTxt.trim().length === 0) {
        showToast('Please enter a valid message');
        return;
      }
    }
    safeApiCall(async () => {
      const res = uploadedFile
        ? await createMessage(chat._id, msgTxt ?? '', uploadedFile.url)
        : await createMessage(chat._id, msgTxt ?? '');
      socket.emit('message', JSON.stringify(res.data.result.message));
      msgRef.current?.setValue('');
      setUploadedFile(null);
    });
  };

  const handleDocumentUpload = () => {
    safeApiCall(
      async () => {
        const doc = await DocumentPicker.pickSingle({
          type: [
            DocumentPicker.types.pdf,
            DocumentPicker.types.images,
            DocumentPicker.types.video,
            DocumentPicker.types.doc,
            DocumentPicker.types.docx,
            DocumentPicker.types.ppt,
            DocumentPicker.types.pptx,
          ],
        });
        const formData = new FormData();
        if (!doc) return;
        const fileData = {
          uri: doc.uri,
          name: doc.name,
          type: doc.type,
          size: doc.size,
        };
        formData.append('file', fileData);
        formData.append('category', 'Chat');
        // showToast('Loading...');
        setIsLoading(true);
        const res = await uploadSingleFile(formData);
        const fileUrl = res.data.result.fileUrl;
        console.log(doc);
        setUploadedFile({
          name: doc.name as string,
          type: doc.type!,
          url: fileUrl,
        });
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
    );
  };

  // useEffect(() => {
  //   const getMessages = () => {
  //     setUiState('loading');
  //     safeApiCall(
  //       async () => {
  //         const res = await fetchMessages(chat._id);
  //         setMessages(res.data.result.messages.reverse());
  //         socket.emit('join room', chat._id);
  //         setUiState('success');
  //       },
  //       () => {
  //         setUiState('failure');
  //       },
  //     );
  //   };
  //   getMessages();
  // }, []);

  useFocusEffect(
    useCallback(() => {
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
    }, [socket]),
  );

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
          <Pressable
            onPress={function () {
              navigation.navigate('GROUP_DETAILS', {
                chatId: chat._id,
              });
            }}>
            <Image source={ImageAssets.Group} style={styles.profileImage} />
          </Pressable>
        ) : (
          <Pressable
            onPress={function () {
              navigation.navigate('VIEW_PROFILE', {
                user: chat.users.find(item => item._id !== user?._id) as User,
              });
            }}>
            <Image
              source={{
                uri: chat.users.find(it => it._id !== user?._id)
                  ?.profilePicture,
              }}
              style={styles.profileImage}
            />
          </Pressable>
        )}
        <Pressable
          style={{
            marginLeft: scale(10),
            justifyContent: 'center',
          }}
          onPress={function () {
            if (chat.isGroupChat) {
              navigation.navigate('GROUP_DETAILS', {
                chatId: chat._id,
              });
            } else {
              navigation.navigate('VIEW_PROFILE', {
                user: chat.users.find(item => item._id !== user?._id) as User,
              });
            }
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
        </Pressable>
      </View>
      <ImageBackground
        source={ImageAssets.ChatBg}
        imageStyle={{opacity: 0.15}}
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
                  {item.attachment ? (
                    <Pressable
                      style={{
                        ...gs.row,
                        ...{
                          // backgroundColor: theme.backgroungColor,
                          marginTop:
                            item.content.length === 0 ? verticalScale(12) : 0,
                          padding: moderateScale(10),
                          ...(senderType === 'me'
                            ? {borderTopLeftRadius: scale(10)}
                            : {borderTopRightRadius: scale(10)}),
                          borderBottomRightRadius: scale(10),
                          borderBottomLeftRadius: scale(10),
                          borderWidth: scale(1),
                          borderColor: theme.secondaryContainer,
                          alignSelf:
                            senderType === 'me' ? 'flex-end' : 'flex-start',
                        },
                      }}
                      onPress={() => {
                        if (
                          isImageUrl(item.attachment) ||
                          isVideoUrl(item.attachment)
                        ) {
                          navigation.navigate('IMAGE_VIEW', {
                            imageUri: item.attachment,
                          });
                        } else {
                          handleDownloadAndView(item.attachment);
                          showToast('Please wait...');
                        }
                      }}>
                      <Image
                        source={
                          isImageUrl(item.attachment)
                            ? {uri: item.attachment}
                            : ImageAssets.DocIcon
                        }
                        style={styles.docIcon}
                      />
                      <SimpleText
                        style={{
                          // opacity: 0.5,
                          color: theme.blackInverse,
                          marginLeft: scale(5),
                          marginEnd: scale(16),
                        }}>
                        {`Tap to view the ${get_url_extension(
                          item.attachment,
                        )} file`}
                        {/* {item.content.length === 0
                          ? Platform.OS === 'ios'
                            ? '              \u00a0'
                            : '           \u00a0'
                          : null} */}
                      </SimpleText>
                      {item.content.length === 0 ? (
                        <SimpleText
                          style={{
                            fontSize: RFValue(8),
                            color: theme.secondaryColor,
                            alignSelf: 'flex-end',
                          }}
                          fontWeight="thin">
                          {moment(item.createdAt).format('h:mm a')}
                        </SimpleText>
                      ) : null}
                    </Pressable>
                  ) : null}
                  {item.content.length !== 0 && (
                    <View
                      style={
                        senderType === 'me'
                          ? styles.sendChatContainer
                          : styles.receiveChatContainer
                      }>
                      {chat.isGroupChat && senderType !== 'me' && (
                        <SimpleText
                          size={RFValue(10)}
                          color={theme.blackInverse}
                          fontWeight="bold"
                          style={{top: -4}}
                          textProps={{
                            onPress: function () {
                              navigation.navigate('VIEW_PROFILE', {
                                user: item.sender,
                              });
                            },
                          }}>
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
                  )}

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
        {uploadedFile && (
          <Pressable
            style={{
              ...gs.row,
              ...{
                padding: moderateScale(10),
                width: Dimensions.get('window').width * 0.9,
                alignSelf: 'center',
                backgroundColor: theme.whiteInverse,
                borderRadius: 10,
              },
            }}
            onPress={() => {
              if (
                isImageUrl(uploadedFile.url) ||
                isVideoUrl(uploadedFile.url)
              ) {
                navigation.navigate('IMAGE_VIEW', {
                  imageUri: uploadedFile.url,
                });
              } else {
                handleDownloadAndView(uploadedFile.url);
                showToast('Please wait...');
              }
            }}>
            <Pressable
              style={styles.crossBtn}
              onPress={function () {
                setUploadedFile(null);
              }}>
              <MaterialCommunityIcons
                name="close"
                size={RFValue(16)}
                color={ColorAssets.white}
                style={{alignSelf: 'center'}}
              />
            </Pressable>
            <Image
              source={
                uploadedFile && uploadedFile.type.startsWith('image')
                  ? {uri: uploadedFile.url}
                  : ImageAssets.DocIcon
              }
              style={styles.docIcon}
            />
            <SimpleText style={{marginLeft: scale(5), width: '85%'}}>
              {uploadedFile?.name}
            </SimpleText>
          </Pressable>
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
              backgroundColor: !theme.isDark ? '#F3F4F6' : theme.surfaceVariant,
            }}
          />
          <RippleButton style={{marginEnd: 10}} onPress={handleDocumentUpload}>
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
      <LoadingModal visible={isLoading} />
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
      resizeMode: 'cover',
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
      backgroundColor: '#fafafa',
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
    docIcon: {
      width: scale(30),
      height: scale(30),
      borderRadius: scale(10),
    },
    imgFile: {
      height: verticalScale(180),
      width: scale(140),
      resizeMode: 'cover',
      borderRadius: 20,
    },
    crossBtn: {
      position: 'absolute',
      right: -8,
      top: -8,
      height: 24,
      width: 24,
      borderRadius: 12,
      backgroundColor: ColorAssets.red600,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

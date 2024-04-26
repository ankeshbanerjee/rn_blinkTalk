import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/params';
import {ThemeData} from '../theme/theme_data';
import {ThemeContext} from '../contexts/theme_context';
import SimpleText from '../components/SimpleText';
import {Appbar} from 'react-native-paper';
import {gs} from '../theme/global_styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import {UserContext} from '../contexts/UserContext';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Divider from '../components/Divider';
import BottomSheetComponent, {
  BottomSheetRefType,
} from '../components/BottomSheetComponent';
import {User} from '../models/UserResponse';
import {safeApiCall} from '../utils/axios_utils';
import LoadingComponent from '../components/LoadingComponent';
import IconTextField from '../components/IconTextField';
import {fetchAllUsers} from '../services/user_services';
import {
  addUserToGroup,
  fetchChatById,
  removeUser,
} from '../services/chat_service';
import {showToast} from '../utils/apputils';
import LoadingModal from '../components/LoadingModal';
import {Chat} from '../models/ChatResponse';

type Props = NativeStackScreenProps<RootStackParamsList, 'GROUP_DETAILS'>;

const GroupDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const [chat, setChat] = useState<Chat>({} as Chat);
  const {theme} = useContext(ThemeContext);
  const {user} = useContext(UserContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const addUserBottomSheetRef = useRef<BottomSheetRefType>(null);
  const [isUsersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadUsers = useCallback(() => {
    setUsersLoading(true);
    safeApiCall(
      async () => {
        const res = await fetchAllUsers();
        const ids = chat.users.map(item => item._id);
        const users = res.data.result.users.filter(
          item => !ids.includes(item._id),
        );
        setUsers(users);
        setFilteredUsers(users);
        setUsersLoading(false);
      },
      () => {
        setUsersLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    setIsLoading(true);
    safeApiCall(
      async () => {
        const res = await fetchChatById(route.params.chatId);
        setChat(res.data.result.chat);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
    );
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={function () {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={chat.chatName} />
        </Appbar.Header>
        <View
          style={[
            gs.row,
            {
              justifyContent: 'space-between',
              marginHorizontal: scale(12),
              marginVertical: verticalScale(10),
            },
          ]}>
          <SimpleText fontWeight="semi-bold" size={RFValue(16)}>
            Members
          </SimpleText>
          {user?._id === chat.groupAdmin?._id ? (
            <AntDesign
              name="adduser"
              size={RFValue(20)}
              color={theme.blackInverse}
              onPress={function () {
                addUserBottomSheetRef.current?.present();
                loadUsers();
              }}
            />
          ) : null}
        </View>
        <FlatList
          data={chat.users}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({item, index}) => (
            <Pressable
              onLongPress={function () {
                if (user?._id !== chat.groupAdmin?._id) return;
                Alert.alert(
                  'Remove User',
                  `Do you want to remove ${item.name} from this group?`,
                  [
                    {
                      text: 'No',
                      onPress: () => {},
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        setIsLoading(true);
                        safeApiCall(
                          async () => {
                            const res = await removeUser(item._id, chat._id);
                            showToast(res.data.message);
                            const res1 = await fetchChatById(chat._id);
                            setChat(res1.data.result.chat);
                            setIsLoading(false);
                            // navigation.reset({routes: [{name: 'MAIN'}]});
                          },
                          () => {
                            setIsLoading(false);
                          },
                        );
                      },
                    },
                  ],
                );
              }}
              style={[
                gs.row,
                {
                  gap: 14,
                  paddingVertical: verticalScale(10),
                  paddingHorizontal: scale(16),
                },
              ]}>
              <Image
                source={{uri: item.profilePicture}}
                style={styles.userImg}
              />
              <SimpleText size={RFValue(14)}>
                {item.name + (user?._id === item._id ? ' (You)' : '')}
              </SimpleText>
            </Pressable>
          )}
        />
        <BottomSheetComponent ref={addUserBottomSheetRef} snapPoint={90}>
          <View
            style={{
              marginHorizontal: scale(16),
              paddingTop: verticalScale(12),
            }}>
            <SimpleText
              fontWeight="medium"
              style={{
                fontSize: RFValue(14),
                marginBottom: verticalScale(14),
                color: theme.secondaryColor,
              }}>
              Add User
            </SimpleText>
            <IconTextField
              placeholder="Search user"
              textInputProps={{
                onChange: function (e) {
                  const txt = e.nativeEvent.text;
                  const filtered = users.filter(user =>
                    user.name.toLowerCase().includes(txt.toLowerCase()),
                  );
                  setFilteredUsers(filtered);
                },
              }}
            />
            {isUsersLoading ? (
              <LoadingComponent />
            ) : (
              <FlatList
                data={filteredUsers}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({item, index}) => (
                  <Pressable
                    style={[
                      gs.row,
                      {gap: 14, paddingVertical: verticalScale(10)},
                    ]}
                    onPress={function () {
                      addUserBottomSheetRef.current?.close();
                      setIsLoading(true);
                      safeApiCall(
                        async () => {
                          const res = await addUserToGroup(item._id, chat._id);
                          showToast(res.data.message);
                          const res1 = await fetchChatById(chat._id);
                          setChat(res1.data.result.chat);
                          setIsLoading(false);
                          // setTimeout(() => {
                          // navigation.reset({routes: [{name: 'MAIN'}]});
                          // }, 400);
                        },
                        () => {
                          setIsLoading(false);
                        },
                      );
                    }}>
                    <Image
                      source={{uri: item.profilePicture}}
                      style={styles.userImg}
                    />
                    <SimpleText size={RFValue(14)}>{item.name}</SimpleText>
                  </Pressable>
                )}
              />
            )}
          </View>
        </BottomSheetComponent>
      </View>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default GroupDetailsScreen;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroungColor,
    },
    userImg: {
      height: moderateScale(50),
      width: moderateScale(50),
      borderRadius: moderateScale(25),
    },
  });

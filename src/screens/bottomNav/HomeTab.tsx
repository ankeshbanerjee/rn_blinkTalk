import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
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
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomNavParamsList} from '../../navigation/params';
import {ThemeContext} from '../../contexts/theme_context';
import {ThemeData} from '../../theme/theme_data';
import HomeAppBar from '../../components/HomeAppBar';
import {safeApiCall} from '../../utils/axios_utils';
import {
  createChat,
  createGroupChat,
  fetchChats,
} from '../../services/chat_service';
import {Chat} from '../../models/ChatResponse';
import {showToast, UiState} from '../../utils/apputils';
import LoadingComponent from '../../components/LoadingComponent';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import ChatItem from '../../components/ChatItem';
import {ImageAssets} from '../../../assets';
import {FloatingAction, IActionProps} from 'react-native-floating-action';
import ColorAssets from '../../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import BottomSheetComponent, {
  BottomSheetRefType,
} from '../../components/BottomSheetComponent';
import IconTextField, {
  IconTextFieldRefProps,
} from '../../components/IconTextField';
import {User} from '../../models/UserResponse';
import {fetchAllUsers} from '../../services/user_services';
import SimpleText from '../../components/SimpleText';
import {gs} from '../../theme/global_styles';
import {UserContext} from '../../contexts/UserContext';
import Divider from '../../components/Divider';
import {FlatList} from 'react-native-gesture-handler';
import LoadingModal from '../../components/LoadingModal';
import {Button, Checkbox} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconTextField2 from '../../components/IconTextField2';

type Props = BottomTabScreenProps<BottomNavParamsList, 'HOME'>;

const actions: IActionProps[] = [
  {
    text: 'New Single Chat',
    icon: (
      <AntDesign name="adduser" size={RFValue(16)} color={ColorAssets.black} />
    ),
    name: 'new_single_chat',
    color: '#FBEBA1',
  },
  {
    text: 'New Group Chat',
    icon: (
      <AntDesign
        name="addusergroup"
        size={RFValue(16)}
        color={ColorAssets.black}
      />
    ),
    name: 'new_group_chat',
    color: '#A3FBA1',
  },
];

const HomeTab: React.FC<Props> = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const {user} = useContext(UserContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [uiState, setUiState] = useState<UiState>('idle');
  const fabRef = useRef<FloatingAction>();
  const newSingleChatBottomSheetRef = useRef<BottomSheetRefType>(null);
  const [isUsersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const newGroupChatBottomSheetRef = useRef<BottomSheetRefType>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const groupNameBottomSheetRef = useRef<BottomSheetRefType>(null);
  const groupNameRef = useRef<IconTextFieldRefProps>(null);

  const loadUsers = () => {
    setUsersLoading(true);
    safeApiCall(
      async () => {
        const res = await fetchAllUsers();
        const users = res.data.result.users.filter(
          item => item._id !== user?._id,
        );
        setUsers(users);
        setFilteredUsers(users);
        setUsersLoading(false);
      },
      () => {
        setUsersLoading(false);
      },
    );
  };

  const loadChats = () => {
    setUiState('loading');
    safeApiCall(
      async () => {
        const res = await fetchChats();
        setChats(res.data.result.chats);
        setUiState('success');
      },
      () => {
        setUiState('failure');
      },
    );
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <View style={styles.container}>
      <HomeAppBar />
      <ImageBackground
        source={ImageAssets.ChatBg}
        imageStyle={{opacity: 0.15}}
        style={{flex: 1}}>
        {uiState === 'loading' ? (
          <LoadingComponent />
        ) : (
          <>
            <FlatList
              data={chats}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: verticalScale(12),
                paddingBottom: verticalScale(150),
              }}
              renderItem={({item, index}) => (
                <ChatItem
                  chat={item}
                  onPress={function () {
                    navigation.getParent()?.navigate('CHAT', {chat: item});
                  }}
                />
              )}
            />
            <FloatingAction
              ref={fabRef as Ref<any>}
              tintColor={ColorAssets.white}
              actions={actions}
              onPressItem={name => {
                switch (name) {
                  case 'new_single_chat':
                    loadUsers();
                    newSingleChatBottomSheetRef.current?.present();
                    break;

                  case 'new_group_chat':
                    loadUsers();
                    newGroupChatBottomSheetRef.current?.present();
                    break;
                }
              }}
              animated
              color={theme.primaryColor}
            />
          </>
        )}
      </ImageBackground>
      <BottomSheetComponent ref={newSingleChatBottomSheetRef} snapPoint={90}>
        <View
          style={{marginHorizontal: scale(16), paddingTop: verticalScale(12)}}>
          <SimpleText
            fontWeight="medium"
            style={{
              fontSize: RFValue(14),
              marginBottom: verticalScale(14),
              color: theme.secondaryColor,
            }}>
            Create New Single Chat
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
                    newSingleChatBottomSheetRef.current?.close();
                    setIsLoading(true);
                    safeApiCall(
                      async () => {
                        const res = await createChat(item._id);
                        showToast(res.data.message);
                        setIsLoading(false);
                        loadChats();
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
      <BottomSheetComponent ref={newGroupChatBottomSheetRef} snapPoint={90}>
        <View
          style={{marginHorizontal: scale(16), paddingTop: verticalScale(12)}}>
          <SimpleText
            fontWeight="medium"
            style={{
              fontSize: RFValue(14),
              marginBottom: verticalScale(14),
              color: theme.secondaryColor,
            }}>
            Create New Group Chat
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
                    if (selectedUserIds.includes(item._id)) {
                      const temp = selectedUserIds.filter(
                        it => it !== item._id,
                      );
                      setSelectedUserIds(temp);
                    } else {
                      setSelectedUserIds(p => [...p, item._id]);
                    }
                  }}>
                  <Image
                    source={{uri: item.profilePicture}}
                    style={styles.userImg}
                  />
                  <SimpleText size={RFValue(14)}>{item.name}</SimpleText>
                  <View style={{flex: 1}} />
                  <Checkbox
                    status={
                      selectedUserIds.includes(item._id)
                        ? 'checked'
                        : 'unchecked'
                    }
                  />
                </Pressable>
              )}
            />
          )}
        </View>
        <View style={{flex: 1}} />
        <Button
          icon="arrow-right"
          mode="contained"
          textColor={ColorAssets.white}
          buttonColor={theme.primaryColor}
          labelStyle={{
            fontSize: 16,
            fontFamily: 'Inter-Bold',
          }}
          style={{
            alignSelf: 'center',
            borderRadius: scale(5),
            marginBottom: useSafeAreaInsets().bottom,
            width: '90%',
          }}
          onPress={function () {
            if (selectedUserIds.length === 0) {
              showToast('Please select atleast one user');
              return;
            }
            newGroupChatBottomSheetRef.current?.close();
            setTimeout(() => {
              groupNameBottomSheetRef.current?.present();
            }, 500);
          }}>
          Proceed
        </Button>
      </BottomSheetComponent>
      <BottomSheetComponent
        ref={groupNameBottomSheetRef}
        snapPoint={50}
        onDismissCallback={function () {
          setSelectedUserIds([]);
          groupNameRef.current?.setValue('');
        }}>
        <View
          style={{
            marginHorizontal: scale(16),
            marginTop: verticalScale(10),
            gap: verticalScale(14),
          }}>
          <SimpleText
            fontWeight="medium"
            size={RFValue(14)}
            color={theme.secondaryColor}>
            Change Your Name
          </SimpleText>
          <IconTextField2
            placeholder="Enter group name"
            title="Group Name"
            ref={groupNameRef}
          />
          <Button
            icon="plus"
            mode="contained"
            textColor={ColorAssets.white}
            buttonColor={theme.primaryColor}
            labelStyle={{
              fontSize: 16,
              fontFamily: 'Inter-Bold',
            }}
            style={{
              alignSelf: 'center',
              borderRadius: scale(5),
              width: '100%',
            }}
            onPress={function () {
              const groupName = groupNameRef.current?.getText();
              if (!groupName || groupName.trim().length === 0) {
                showToast('Please enter a valid group name');
                return;
              }
              if (selectedUserIds.length === 0) {
                showToast('There should atleast 2 members in a group');
                return;
              }
              groupNameBottomSheetRef.current?.close();
              setIsLoading(true);
              safeApiCall(
                async () => {
                  const res = await createGroupChat(groupName, selectedUserIds);
                  showToast(res.data.message);
                  setIsLoading(false);
                  loadChats();
                },
                () => {
                  setIsLoading(false);
                },
              );
            }}>
            Create group
          </Button>
        </View>
      </BottomSheetComponent>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default HomeTab;

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

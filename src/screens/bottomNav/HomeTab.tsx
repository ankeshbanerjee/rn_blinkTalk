import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import SimpleText from '../../components/SimpleText';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomNavParamsList} from '../../navigation/params';
import {ThemeContext} from '../../contexts/theme_context';
import {ThemeData} from '../../theme/theme_data';
import HomeAppBar from '../../components/HomeAppBar';
import {safeApiCall} from '../../utils/axios_utils';
import {fetchChats} from '../../services/chat_service';
import {Chat} from '../../models/ChatResponse';
import {UiState} from '../../utils/apputils';
import LoadingComponent from '../../components/LoadingComponent';
import {verticalScale} from 'react-native-size-matters';
import ChatItem from '../../components/ChatItem';

type Props = BottomTabScreenProps<BottomNavParamsList, 'HOME'>;

const HomeTab: React.FC<Props> = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [uiState, setUiState] = useState<UiState>('idle');

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
      {uiState === 'loading' ? (
        <LoadingComponent />
      ) : (
        <FlatList
          data={chats}
          contentContainerStyle={{
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
      )}
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
  });

import {StyleSheet, Image, View, Pressable} from 'react-native';
import React, {useContext, useMemo, useState} from 'react';
import {Chat} from '../models/ChatResponse';
import SimpleText from './SimpleText';
import {UserContext} from '../contexts/UserContext';
import {ImageAssets} from '../../assets';
import {ThemeContext} from '../contexts/theme_context';
import {ThemeData} from '../theme/theme_data';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {gs} from '../theme/global_styles';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  chat: Chat;
  onPress: () => void;
}
const ChatItem: React.FC<Props> = ({chat, onPress}) => {
  const {user} = useContext(UserContext);
  const {theme} = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <Pressable style={[gs.row, styles.container]} onPress={onPress}>
      {chat.isGroupChat ? (
        <Image source={ImageAssets.Group} style={styles.image} />
      ) : (
        <Image
          source={{
            uri: chat.users.find(it => it._id !== user?._id)?.profilePicture,
          }}
          style={styles.image}
        />
      )}
      <SimpleText
        color={theme.onSecondaryContainer}
        fontWeight="regular"
        size={RFValue(14)}>
        {chat.isGroupChat
          ? chat.chatName
          : chat.users.find(it => it._id !== user?._id)?.name}
      </SimpleText>
    </Pressable>
  );
};

export default ChatItem;

const getStyles = (theme: ThemeData) =>
  StyleSheet.create({
    container: {
      borderWidth: 0.5,
      borderColor: theme.onSurfaceVariant,
      backgroundColor: theme.surfaceVariant,
      paddingVertical: verticalScale(14),
      paddingHorizontal: scale(14),
      marginHorizontal: scale(12),
      marginBottom: verticalScale(10),
      borderRadius: 10,
      gap: scale(14),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 5,
    },
    image: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(20),
      resizeMode: 'cover',
    },
  });

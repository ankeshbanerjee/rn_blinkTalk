/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

// message object
// {
//   "data": {
//     "body": "hlow",
//     "title": "user1"
//   },
//   "from": "141554066415",
//   "messageId": "0:1728406665031374%50962712f9fd7ecd",
//   "sentTime": 1728406665023,
//   "ttl": 2419200
// }

async function onBackgroundMessasgeReceived(message) {
  const channelId = await notifee.createChannel({
    id: 'background_notification_channel',
    name: 'Message notifications',
    importance: AndroidImportance.HIGH,
    sound: 'message',
  });

  await notifee.displayNotification({
    id: message.messageId,
    title: message.data.title,
    body: message.data.body,
    data: message.data,
    android: {
      channelId,
      smallIcon: 'ic_launcher_foreground',
      // largeIcon: ImageAssets.Logo,
      importance: AndroidImportance.HIGH,
      sound: 'message',
      pressAction: {
        id: 'default',
      },
    },
  });
}

async function onForegroundMessageReceived(message) {
  const channelId = await notifee.createChannel({
    id: 'foreground_notification_channel',
    name: 'Silent notifications',
    importance: AndroidImportance.LOW,
  });

  await notifee.displayNotification({
    id: message.messageId,
    title: message.data.title,
    body: message.data.body,
    data: message.data,
    android: {
      channelId,
      smallIcon: 'ic_launcher_foreground',
      // largeIcon: ImageAssets.Logo,
      importance: AndroidImportance.LOW,
      pressAction: {
        id: 'default',
      },
    },
  });
}

messaging().onMessage(onForegroundMessageReceived);
messaging().setBackgroundMessageHandler(onBackgroundMessasgeReceived);

AppRegistry.registerComponent(appName, () => App);

// firebase-messaging-headless.ts
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export default async (remoteMessage: any) => {
  console.log('📩 [HEADLESS] Mensagem recebida:', remoteMessage);
};

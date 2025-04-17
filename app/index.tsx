import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getMessaging, requestPermission, AuthorizationStatus, getToken, onMessage, onTokenRefresh } from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidStyle } from '@notifee/react-native';
import { firebaseConfig } from '../firebaseConfig';
import { requestNotificationPermission } from '@/requestNotificationPermission';

// index.tsx
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from '../app'; // ou './App', dependendo do nome
import firebaseMessagingHeadless from '../firebase-messaging-headless';
import '../notifeeBackgroundHandler'; // cria o canal de notificação aqui

const appName = 'CampusConnect';

// Registra o handler de mensagens em segundo plano
getMessaging().setBackgroundMessageHandler(firebaseMessagingHeadless);

// Registro do app principal
AppRegistry.registerComponent(appName, () => App);

let app;
try {
  app = getApp();
} catch (err) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { db, auth, messaging };

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    let unsubscribeForeground: any;
    let unsubscribeTokenRefresh: any;
    let unsubscribeOpenedApp: any;
    let unsubscribeNotifee: any;


    const initializeFirebase = async () => {
      requestNotificationPermission();

      try {
        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await getToken(messaging);
          await AsyncStorage.setItem('fcmToken', token);
          console.log('FCM Token:', token);
        }
      } catch (error) {
        console.error('Erro ao inicializar o Firebase:', error);
      }

      // 👉 App em segundo plano
      unsubscribeOpenedApp = messaging.onNotificationOpenedApp(remoteMessage => {
        handleNotification(remoteMessage);
      });

      // 👉 App fechado
      messaging.getInitialNotification().then(remoteMessage => {
        handleNotification(remoteMessage);
      });

      // 👉 App em primeiro plano
      unsubscribeForeground = onMessage(messaging, async remoteMessage => {
        if (remoteMessage?.data) {
          const title = remoteMessage.notification?.title || 'Notificação';
          const body = remoteMessage.notification?.body || 'Você tem uma nova mensagem!';

          await notifee.displayNotification({
            title,
            body,
            data: remoteMessage.data,
            android: {
              smallIcon: 'ic_notification',
              color: '#2A5224',
              channelId: 'default-channel-id',
              pressAction: {
                id: 'default',
              },
              style: {
                type: AndroidStyle.BIGTEXT,
                text: body,
              },
            },
          });
        }
      });

      // 👉 Listener para toques nas notificações do notifee em primeiro plano
      unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data) {
          handleNotification({ data: detail.notification.data });
        }
      });

      // Token atualizado
      unsubscribeTokenRefresh = onTokenRefresh(messaging, async token => {
        await AsyncStorage.setItem('fcmToken', token);
        console.log('Token atualizado:', token);
      });
    };

    const handleNotification = (remoteMessage: any) => {
      if (remoteMessage?.data?.tipo === 'link' && typeof remoteMessage.data.link === 'string') {
        Linking.openURL(remoteMessage.data.link).catch(console.error);
      } else if (remoteMessage?.data?.tipo === 'tela' && typeof remoteMessage.data.tela === 'string') {
        router.push(remoteMessage.data.tela as any);
      }
    };

    initializeFirebase();

    const checkStoredName = async () => {
      try {
        setTimeout(async () => {
          const storedName = await AsyncStorage.getItem('userName');
          if (storedName) {
            router.push('/Screens');
          } else {
            router.push('/Screens/Carousel');
          }
        }, 3000);
      } catch (error) {
        console.error('Erro ao verificar nome armazenado:', error);
      }
    };

    checkStoredName();

    // ✅ Limpa listeners ao desmontar
    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
      if (unsubscribeOpenedApp) unsubscribeOpenedApp();
      if (unsubscribeNotifee) unsubscribeNotifee();
    };
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tela}>
        <Image
          source={require('@/assets/images/fundo.png')}
          style={styles.imagef}
        />
        <View style={styles.logos}>
          <Image
            source={require('@/assets/images/logoCCinicial.gif')}
            style={styles.image2}
          />
          <Image
            source={require('@/assets/images/logoIF.png')}
            style={styles.image3}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imagef: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  image2: {
    height: '35%',
    resizeMode: 'contain',
    marginTop: '40%',
  },
  image3: {
    height: '8%',
    resizeMode: 'contain',
    marginTop: '60%',
  },
  logos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    resizeMode: 'contain',
  },
  tela: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;

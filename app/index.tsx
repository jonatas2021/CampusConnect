import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { initializeApp, getApps } from '@react-native-firebase/app';

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log('Firebase inicializado');

}
import firebaseConfig from './firebaseConfig'; // Importação da configuração do Firebase

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // ✅ Inicializa o Firebase
    const initializeFirebase = async () => {
      try {
        initializeApp(firebaseConfig); // Inicializa o Firebase com a configuração
      } catch (error) {
        console.error('Erro ao inicializar o Firebase:', error);
      }

      // ✅ Solicita permissão e captura o token
      const requestUserPermission = async () => {
        console.log('Solicitando permissão...');
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          console.log('Status da permissão:', authStatus);
      
        if (enabled) {
          console.log('Permissão concedida:', authStatus);
      
          try {
            const token = await messaging().getToken();
            console.log('FCM Token:', token);
            await AsyncStorage.setItem('fcmToken', token);
          } catch (error) {
            console.error('Erro ao obter o token FCM:', error);
          }
        } else {
          console.log('Permissão não concedida');
        }
      };
      

      // Solicita permissão e obtém o token
      await requestUserPermission();

      // Escuta notificações em foreground
      const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        Alert.alert(
          remoteMessage.notification?.title || 'Nova Notificação',
          remoteMessage.notification?.body || ''
        );
      });

      // Configura para receber notificações em background
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Notificação recebida em segundo plano:', remoteMessage);
      });

      // Escuta atualização de token (se o token for renovado)
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(async token => {
        console.log('Token atualizado:', token);
        await AsyncStorage.setItem('fcmToken', token);
      });

      // Limpa os listeners para evitar vazamento de memória
      return () => {
        unsubscribeForeground();
        unsubscribeTokenRefresh();
      };
    };

    // Chama a função assíncrona para inicializar o app
    initializeFirebase();

    // Lógica de redirecionamento após 3 segundos
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
        console.error('Erro ao verificar o nome armazenado:', error);
      }
    };
    

    checkStoredName();

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
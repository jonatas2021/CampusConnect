import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { LogBox } from 'react-native';
import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';  // Importação correta
import { firebaseConfig } from '../firebaseConfig';  // Certifique-se de que o arquivo de configuração está correto.
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Inicializa o Firebase com a configuração
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app); // Agora você pode usar o Firestore


export { db, auth, };


const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Função para inicializar o Firebase e solicitar permissão
    const initializeFirebase = async () => {
      try {
        // Inicializa o Firebase apenas se não estiver já inicializado
        const app = getApp();
        console.log('Firebase inicializado', app);

        // Solicita permissão para notificações
        const authStatus = await messaging().requestPermission();
        const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Permissão concedida:', authStatus);
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
          await AsyncStorage.setItem('fcmToken', token);
        } else {
          console.log('Permissão não concedida');
        }
      } catch (error) {
        console.error('Erro ao inicializar o Firebase ou obter permissão:', error);
      }

      // Escuta notificações em primeiro plano
      const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        Alert.alert(
          remoteMessage.notification?.title || 'Nova Notificação',
          remoteMessage.notification?.body || ''
        );
      });

      // Escuta atualizações de token
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(async token => {
        console.log('Token atualizado:', token);
        await AsyncStorage.setItem('fcmToken', token);
      });

      // Limpar listeners ao desmontar
      return () => {
        unsubscribeForeground();
        unsubscribeTokenRefresh();
      };
    };

    // Chama a função para inicializar o Firebase e permissões
    initializeFirebase();

    // Verifica se há um nome armazenado para redirecionar o usuário
    const checkStoredName = async () => {
      try {
        setTimeout(async () => {
          // Verifica se o nome está no AsyncStorage
          const storedName = await AsyncStorage.getItem('userName');
          if (storedName) {
            router.push('/Screens');
          } else {
            router.push('/Screens/Carousel');
          }
        }, 3000);  // Atraso de 3 segundos para redirecionar
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

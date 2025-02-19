import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkStoredName = async () => {
      setTimeout(async () => {
        const storedName = await AsyncStorage.getItem('userName');

        if (storedName) {
          // Se já tiver um nome salvo, vai direto para a tela principal
          router.push('/Screens');
        } else {
          // Se não tiver nome salvo, redireciona para a tela de cadastro do nome
          router.push('/Screens/Carousel');
        }
      }, 3000); // Aguarda 3 segundos antes de verificar
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

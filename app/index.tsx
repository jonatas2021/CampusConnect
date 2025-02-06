import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      
      if (isFirstLaunch === null) {
        // Primeira vez que o usuário abre o app
        await AsyncStorage.setItem('isFirstLaunch', 'false');
        router.push('/Hello');
      } else {
        // O app já foi aberto antes, vai direto para o Carousel
        router.push('/main/MainScreen');
      }
    };

    checkIfFirstLaunch();
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tela}>
        <Image
          source={require('../assets/images/fundo.png')}
          style={styles.imagef}
        />
        <View style={styles.logos}>
          <Image
            source={require('../assets/images/logoCCinicial.gif')}
            style={styles.image2}
          />
          <Image
            source={require('../assets/images/logoIF.png')}
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

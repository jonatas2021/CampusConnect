import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {

    const timer = setTimeout(() => {
      router.push('/Hello'); // Caminho para a tela principal
    }, 3000);

    return () => clearTimeout(timer); // Limpeza do temporizador
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
    height:'35%',
    resizeMode: 'contain',
    marginTop: '40%',
  },
  image3: {
    height: '8%',
    resizeMode: 'contain',
    marginTop: '60%'
  },
  logos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    resizeMode: 'contain'
  },
  tela: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoadingScreen;

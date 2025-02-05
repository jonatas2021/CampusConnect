import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Hello() {
  const [name, setName] = useState('');

  const router = useRouter();

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleEnter = () => {
    console.log(`Nome enviado: ${name}`);
    router.push('/Questions');
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.sectionContainer}>
        <Image
          source={require('../assets/images/fundo.png')}
          style={styles.imagef}
        />
        <View style={styles.logos}>
          <Image
            source={require('../assets/images/logoCCinicial.gif')}
            style={styles.image2}
          />
        </View>
      </View>

      <View style={styles.caixa}>
        <Text style={styles.bomDiaText}>Olá, Bom dia!</Text>
        
        <Text style={styles.textoInput}>Como você quer ser chamado?</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={name}
          onChangeText={handleNameChange} 
        />
        <TouchableOpacity 
          style={[styles.botao, { backgroundColor: name ? '#2A5A06' : '#ccc' }]} 
          onPress={handleEnter}
          disabled={!name} 
        >
          <Text style={styles.botaoText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
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
    height: '46%',
    resizeMode: 'contain',
    marginBottom: '30%'
  },
  logos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    resizeMode: 'contain',
  },
  sectionContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caixa: {
    width: '100%',
    height: '28%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    padding: '5%',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bomDiaText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '3%',
    alignSelf: 'flex-start', 
  },
  textoInput: {
    fontSize: 20,
    marginBottom: '4%',
    alignSelf: 'flex-start', 
  },
  input: {
    width: '95%',
    height: '20%',
    borderColor: '#001E01',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: '4%',
    fontSize: 16,
    marginBottom: '5%',
    alignSelf: 'center',
  },
  botao: {
    width: '90%',
    paddingVertical: '3%',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  botaoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

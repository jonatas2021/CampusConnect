import React, { useState } from 'react';
import { 
  View, StyleSheet, SafeAreaView, Image, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import BackButton from "@/components/BackButton2";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Hello() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleEnter = async () => {
    console.log(`Nome enviado: ${name}`);
    await AsyncStorage.setItem('userName', name);
    router.push({ pathname: "/Screens", params: { name } });
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Bom dia!";
    else if (hours < 18) return "Boa tarde!";
    else return "Boa noite!";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.rootContainer}>
      {/* <BackButton destination="/Screens/Carousel" /> */}
          <BackButton />  
          <View style={styles.sectionContainer}>
            <Image source={require('@/assets/images/fundo.png')} style={styles.imagef} />
            <View style={styles.logos}>
              <Image source={require('@/assets/images/logoCCinicial.gif')} style={styles.image2} />
            </View>
          </View>

          <View style={styles.caixa}>
            <Text style={styles.bomDiaText}>{getGreeting()}</Text>
            <Text style={styles.textoInput}>Como você quer ser chamado?</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  imagef: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
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
    resizeMode: 'contain'
  },
  sectionContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
    borderTopRightRadius: 20
  },
  bomDiaText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    marginBottom: '3%',
    alignSelf: 'flex-start'
  },
  textoInput: {
    fontSize: RFValue(15),
    marginBottom: '4%',
    alignSelf: 'flex-start'
  },
  input: { 
    width: '95%', 
    height: '20%', 
    borderColor: '#001E01', 
    borderWidth: 2, 
    borderRadius: 5, 
    paddingLeft: '4%', 
    fontSize: RFValue(14), 
    marginBottom: '5%', 
    alignSelf: 'center' 
  },
  botao: { 
    width: '90%', 
    paddingVertical: '3%', 
    borderRadius: 8, 
    alignItems: 'center', 
    alignSelf: 'center' 
  },
  botaoText: { 
    color: 'white', 
    fontSize: RFValue(14), 
    fontWeight: 'bold' 
  },
});

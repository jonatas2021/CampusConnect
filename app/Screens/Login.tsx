import React, { useState } from 'react';
import { 
  View, StyleSheet, SafeAreaView, Image, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth'; // Atualizado para a API modular
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const auth = getAuth();  // Obtenha a instância do Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);  // Método modular
      Alert.alert('Sucesso', 'Login realizado com sucesso!');

      // Redireciona para a tela Admin após o login bem-sucedido
      router.push('/Screens/Notification/UpdateNotification');  // Redireciona para a tela Admin
    } catch (error) {
      console.error('Erro de login: ', error);
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={styles.rootContainer}>
          <BackButton />
          <View style={styles.caixa2}>
            <Text style={styles.observacao}>
              Esta tela é apenas para uso dos administradores do aplicativo. Apenas usuários autorizados têm permissão de acesso.
            </Text>
          </View>
          {/* Imagem de fundo e logo */}
          <View style={styles.sectionContainer}>
            <View style={styles.logos}>
              <Image source={require('@/assets/images/logoinicial.png')} style={styles.image2} />
            </View>
          </View>

          {/* Caixa de login */}
          <View style={styles.caixa}>
            <Text style={styles.bomDiaText}>Bem-vindo!</Text>

            {/* Banner de observação no topo */}
            <View style={styles.observacaoContainer}>
            </View>

            <Text style={styles.textoInput}>Digite suas credenciais de acesso</Text>

            {/* Campos de entrada */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            {/* Botão de login */}
            <TouchableOpacity
              style={[styles.botao, { backgroundColor: email && password ? '#2A5224' : '#ccc' }]}
              onPress={handleLogin}
              disabled={!email || !password}
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
    backgroundColor: '#2A5224',  // Cor de fundo clara
  },
  sectionContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image2: {
    height: '50%',
    resizeMode: 'contain',
    marginBottom: '25%',
  },
  logos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  caixa: {
    width: '100%',
    height: '35%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0, 
    padding: '5%',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },  
  caixa2: {
    width: '95%',
    height: 'auto',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    marginTop: '30%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5
  },
  observacaoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  observacao: {
    fontSize: RFValue(10),
    color: '#2A5224',
    textAlign: 'center',
  },
  bomDiaText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  textoInput: {
    fontSize: RFValue(15),
    marginBottom: '4%',
    alignSelf: 'flex-start',
  },
  input: { 
    width: '95%', 
    height: 50, 
    borderColor: '#2A5224',
    borderWidth: 2, 
    borderRadius: 8, 
    paddingLeft: '4%', 
    fontSize: RFValue(14), 
    marginBottom: '5%', 
    alignSelf: 'center', 
    backgroundColor: '#fff',
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

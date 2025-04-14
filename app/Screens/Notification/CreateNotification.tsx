import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useRouter } from "expo-router";
import { getAuth } from '@react-native-firebase/auth';  // Ajuste aqui para getAuth

export default function CreateNotificationScreen() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();  // Usando getAuth para obter a instância correta

  useEffect(() => {
    const backAction = () => {
      router.push('/Screens/Notification/UpdateNotification');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleCreateNotification = async () => {
    if (!title || !note || !description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Enviar os dados para o Firestore
      await addDoc(collection(db, 'notifications'), {
        title,
        note,
        description,
        link: link || null,
        image: image || null,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Notificação criada com sucesso!');
      setTitle('');
      setNote('');
      setDescription('');
      setLink('');
      setImage('');
      router.push('/Screens/Notification/UpdateNotification');

    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      Alert.alert('Erro', 'Não foi possível criar a notificação.');
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Criar Notificação</Text>
      <View style={styles.separator} />
      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Nota" value={note} onChangeText={setNote} />
      <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Link (opcional)" value={link} onChangeText={setLink} />
      <TextInput style={styles.input} placeholder="Link da Imagem (opcional)" value={image} onChangeText={setImage} />

      <Pressable style={styles.button} onPress={handleCreateNotification}>
        <Text style={styles.buttonText}>Criar Notificação</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '6%',
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    marginTop: '10%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    marginBottom: 20
  },
});

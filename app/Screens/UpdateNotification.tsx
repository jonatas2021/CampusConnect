import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from "expo-router";
import { PASSWORD } from '@env';

interface Notification {
  id: string;
  title: string;
  note: string;
  description: string;
  link?: string;
}

export default function ManageNotificationsScreen() {  // Adicionando a prop 'navigation'
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotifications(notificationsData);
      });

    return () => unsubscribe();
  }, []);

  const handleEditNotification = async () => {
    if (!selectedNotification) {
      Alert.alert('Erro', 'Nenhuma notificação selecionada.');
      return;
    }

    if (!title || !note || !description || !password) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== PASSWORD) {
      Alert.alert('Erro', 'Senha incorreta.');
      return;
    }

    try {
      await firestore()
        .collection('notifications')
        .doc(selectedNotification.id)
        .update({
          title,
          note,
          description,
          link: link || null,
          password,
        });

      Alert.alert('Sucesso', 'Notificação editada com sucesso!');
      setSelectedNotification(null);
      setTitle('');
      setNote('');
      setDescription('');
      setLink('');
      setPassword('');
    } catch (error) {
      console.error('Erro ao editar notificação:', error);
      Alert.alert('Erro', 'Não foi possível editar a notificação.');
    }
  };

  const handleDeleteNotification = async () => {
    if (!selectedNotification) {
      Alert.alert('Erro', 'Nenhuma notificação selecionada.');
      return;
    }

    if (password !== '946132123c') {
      Alert.alert('Erro', 'Senha incorreta.');
      return;
    }

    try {
      await firestore().collection('notifications').doc(selectedNotification.id).delete();

      Alert.alert('Sucesso', 'Notificação excluída com sucesso!');
      setSelectedNotification(null);
      setTitle('');
      setNote('');
      setDescription('');
      setLink('');
      setPassword('');
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      Alert.alert('Erro', 'Não foi possível excluir a notificação.');
    }
  };

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setTitle(notification.title);
    setNote(notification.note);
    setDescription(notification.description);
    setLink(notification.link || '');
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Gerenciar Notificações</Text>
      <View style={styles.separator} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.notificationItem} onPress={() => handleSelectNotification(item)}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
          </Pressable>
        )}
      />

      {selectedNotification && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Nota"
            value={note}
            onChangeText={setNote}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Link (opcional)"
            value={link}
            onChangeText={setLink}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={handleEditNotification}>
            <Text style={styles.buttonText}>Editar Notificação</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDeleteNotification}>
            <Text style={styles.buttonText}>Excluir Notificação</Text>
          </Pressable>
        </View>
      )}

      {/* Botão para ir para a tela de criação de notificação */}
      <Pressable style={[styles.button, styles.createButton]} onPress={() => router.push('/Screens/CreateNotification')}>
        <Text style={styles.buttonText}>Criar Nova Notificação</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '6%',
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
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
  deleteButton: {
    backgroundColor: '#f44336', // Vermelho para excluir
  },
  createButton: {
    backgroundColor: '#00A8FF', // Vermelho para excluir
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
    marginBottom: 20,
  },
  notificationItem: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
    borderRadius: 8,
  },
  notificationTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#333',
  },
});

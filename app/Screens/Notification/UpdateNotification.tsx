import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth'; // Atualizado
import { useRouter } from "expo-router";

interface Notification {
  id: string;
  title: string;
  note: string;
  description: string;
  link?: string;
  image?: string;
}

export default function ManageNotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [user, setUser] = useState<any>(null);  // Estado para o usuário autenticado
  const router = useRouter();
  const db = getFirestore();  // Firestore permanece igual

  useEffect(() => {
    const backAction = () => {
      router.push('/Screens');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const loadNotificationsRealtime = () => {
    return onSnapshot(
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotifications(notificationsData);
      }
    );
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);

    const unsubscribeNotifications = loadNotificationsRealtime();

    return () => {
      unsubscribeAuth();
      unsubscribeNotifications();
    };
  }, []);

  const handleEditNotification = async () => {
    if (!selectedNotification) {
      Alert.alert('Erro', 'Nenhuma notificação selecionada.');
      return;
    }

    if (!title || !note || !description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login para editar.');
      return;
    }

    try {
      const notificationRef = doc(db, 'notifications', selectedNotification.id);
      await updateDoc(notificationRef, {
        title,
        note,
        description,
        link: link || null,
        image: image || null,
      });

      Alert.alert('Sucesso', 'Notificação editada com sucesso!');
      setSelectedNotification(null);
      setTitle('');
      setNote('');
      setDescription('');
      setLink('');
      setImage('');
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

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login para excluir.');
      return;
    }

    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a notificação "${selectedNotification.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const notificationRef = doc(db, 'notifications', selectedNotification.id);
              await deleteDoc(notificationRef);

              Alert.alert('Sucesso', 'Notificação excluída com sucesso!');
              setSelectedNotification(null);
              setTitle('');
              setNote('');
              setDescription('');
              setLink('');
              setImage('');
            } catch (error) {
              console.error('Erro ao excluir notificação:', error);
              Alert.alert('Erro', 'Não foi possível excluir a notificação.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setTitle(notification.title);
    setNote(notification.note);
    setDescription(notification.description);
    setLink(notification.link || '');
    setImage(notification.image || '');
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      Alert.alert('Sucesso', 'Você saiu com sucesso.');
      router.push('/Screens'); // Redireciona para a tela de login após logout
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  return (
    <View style={styles.container}>
      <BackButton destination="/Screens" />
      <Text style={styles.title}>Gerenciar Notificações</Text>
      <View style={styles.separator} />
      <View style={styles.sair}>
        <Text style={styles.userInfo}>
          {user ? `Usuário: ${user.email}` : 'Nenhum usuário autenticado'}
        </Text>
        {user && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </Pressable>
        )}
      </View>

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
          <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Nota" value={note} onChangeText={setNote} />
          <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder="Link (opcional)" value={link} onChangeText={setLink} />
          <TextInput style={styles.input} placeholder="Link da Imagen (opcional)" value={image} onChangeText={setImage} />

          <Pressable style={styles.button} onPress={handleEditNotification}>
            <Text style={styles.buttonText}>Editar Notificação</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDeleteNotification}>
            <Text style={styles.buttonText}>Excluir Notificação</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={[styles.button, styles.createButton]} onPress={() => router.push('/Screens/Notification/CreateNotification')}>
        <Text style={styles.buttonText}>Criar Nova Notificação</Text>
      </Pressable>

      <Pressable style={styles.buttonuser} onPress={() => router.push('/Screens/Notification/UserListScreen')}>
        <Text style={styles.buttonText}>Usuários do Aplicativo</Text>
      </Pressable>
            <Pressable style={styles.buttonDemo} onPress={() => router.push('/Screens/DemoWeek/DemoLista')}>
        <Text style={styles.buttonText}>Demo Week</Text>
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
  buttonuser: {
    backgroundColor: '#2A5224',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
    buttonDemo: {
    backgroundColor: '#2A2B73',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336', // Vermelho para excluir
  },
  createButton: {
    backgroundColor: '#00A8FF', // Azul para criar
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
  userInfo: {
    fontSize: RFValue(14),
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff5722', // Laranja para o botão de logout
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10
  },
  sair: {
    flexDirection: 'row', // Organiza os itens em linha (lado a lado)
    justifyContent: 'center', // Distribui os itens igualmente, com espaço entre eles
    alignItems: 'center', // Alinha os itens verticalmente no centro
    marginBottom: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

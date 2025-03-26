import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Linking } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, query, orderBy, getDocs } from '@react-native-firebase/firestore';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

interface Notification {
  id: string;
  title: string;
  note: string;
  description: string;
  link?: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar notificações do Firestore + AsyncStorage
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Carregar notificações do Firestore com API modular
        const db = getFirestore();
        const notificationsQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(notificationsQuery);

        // Carregar notificações do AsyncStorage
        const storedNotifications = await AsyncStorage.getItem('notifications');
        const savedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

        // Atualizar o estado com as notificações
        const notificationsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const savedNotification = savedNotifications.find((n: Notification) => n.id === doc.id);

          return {
            id: doc.id,
            title: data.title,
            note: data.note,
            description: data.description,
            link: data.link,
            read: savedNotification ? savedNotification.read : false,
          };
        });

        setNotifications(notificationsData);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      } finally {
        setLoading(false); // Marcar o carregamento como concluído
      }
    };

    loadNotifications();

    // Configurar listener para notificações em primeiro plano
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      console.log('Notificação recebida em primeiro plano:', remoteMessage);
      // Aqui você pode atualizar as notificações no estado ou fazer outras ações
    });

    // Limpar listener ao desmontar o componente
    return () => unsubscribe();
  }, []); // Executa apenas uma vez ao inicializar o componente

  // Salvar notificações no AsyncStorage
  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      console.log('Notificações salvas:', updatedNotifications);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  // Marcar como lida e abrir link
  const handleNotificationPress = async (id: string, link?: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications); // Aguardar o retorno de saveNotifications

    if (link) {
      try {
        await Linking.openURL(link);
      } catch (err) {
        console.error('Erro ao abrir o link:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Notificações</Text>
      <View style={styles.separator} />

      {loading ? (
        <Text>Carregando notificações...</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotifications}>Nenhuma notificação nova.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.notification, item.read ? styles.read : styles.unread]}
              onPress={() => handleNotificationPress(item.id, item.link)}
            >
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationNote}>{item.note}</Text>
              <Text style={styles.notificationDescription}>{item.description}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    marginTop: '10%',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  notification: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  unread: {
    backgroundColor: '#92C36B',
  },
  read: {
    backgroundColor: '#e0e0e0',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  noNotifications: {
    fontSize: 16,
    color: '#888',
  },
});

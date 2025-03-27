import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Linking } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import { useNotifications } from '@/app/context/NotificationsContext';

export default function NotificationsScreen() {
  const { notifications, markAsRead } = useNotifications(); // ✅ Remove 'setNotifications'

  const handleNotificationPress = async (id: string, link?: string) => {
    markAsRead(id); // ✅ Usa markAsRead para marcar como lida

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

      {notifications.length === 0 ? (
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

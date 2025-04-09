import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Linking, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';
import { useNotifications } from '@/app/context/NotificationsContext';
import { useRouter } from 'expo-router';
import { KnownRoute, knownRoutes } from "@/src/config/routes";
import FastImage from 'react-native-fast-image';


export default function NotificationsScreen() {
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();

  const handleNotificationPress = async (id: string, link?: string) => {
    markAsRead(id);

    if (!link) return;

    if (knownRoutes.includes(link as KnownRoute)) {
      router.push(link as any);
    } else {
      try {
        await Linking.openURL(link);
      } catch (err) {
        console.error("Erro ao abrir o link externo:", err);
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
              {/* Título em destaque, ocupando toda a largura */}
              <Text style={styles.notificationTitle}>{item.title}</Text>

              <View style={styles.contentRow}>
                {/* Conteúdo textual (nota + descrição) */}
                <View style={styles.textContainer}>
                  <Text style={styles.notificationNote}>{item.note}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>

                {/* Imagem (30%) se existir */}
                {item.image && (
                  <FastImage
                    source={{
                      uri: item.image,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={styles.notificationImage}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
              </View>
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
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    flex: 7,
    paddingRight: 8,
  },
  notificationImage: {
    flex: 3,
    height: '100%',
    borderRadius: 8,
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
    marginBottom: 6,
    color: '#222',
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

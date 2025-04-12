import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { getFirestore, collection, onSnapshot, orderBy, query } from '@react-native-firebase/firestore';
import BackButton from '@/components/BackButton';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const db = getFirestore();

const UserListScreen = () => {
  const [users, setUsers] = useState<{ id: string; model: string; createdAt: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.push('/Screens/Notification/UpdateNotification');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        model: doc.data().model || 'Modelo desconhecido',
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setUsers(userList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao escutar usuários:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton destination="/Screens/Notification/UpdateNotification" />
      <Text style={styles.title}>Lista de Usuários</Text>
            <View style={styles.separator} />
      <Text style={styles.subtitle}>Total: {users.length}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.deviceRow}>
              <MaterialIcons name="phone-android" size={20} color="#0f172a" style={styles.deviceIcon} />
              <Text style={styles.modelText}>{item.model}</Text>
            </View>
            <Text style={styles.idText}>{item.id}</Text>
            <View style={styles.dateContainer}>
              <Feather name="clock" size={14} color="#64748b" />
              <Text style={styles.dateText}>
                {item.createdAt?.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    paddingTop: '6%',
    alignItems: 'center',
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: '10%',
  },
  subtitle: {
    fontSize: RFValue(16),
    color: '#475569',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 14,
    borderRadius: 16,
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deviceIcon: {
    marginRight: 8,
  },
  modelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  idText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default UserListScreen;

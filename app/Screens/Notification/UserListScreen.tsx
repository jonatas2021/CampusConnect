import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import BackButton from '@/components/BackButton';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRouter } from 'expo-router'; // ou 'next/router' se for web

const db = getFirestore();

const UserListScreen = () => {
    const [users, setUsers] = useState<{ id: string; model: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

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

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'users'));
            const userList = snapshot.docs.map(doc => ({
                id: doc.id,
                model: doc.data().model || 'Modelo desconhecido',
            }));
            setUsers(userList);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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
            <Text style={styles.title}>Gerenciar Notificações</Text>
            <View style={styles.separator} />
            <Text style={styles.header}>👥 Total de usuários: {users.length}</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.idText}>{item.id}</Text>
                        <Text style={styles.modelText}>{item.model}</Text>
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f4f4f4',
      alignItems: 'center', // centraliza horizontalmente
      paddingTop: '6%',
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: '#333',
    marginTop: '10%',

    },
    separator: {
      width: "90%", // reduzido para centralizar melhor
      height: 2,
      backgroundColor: "#000",
      marginBottom: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 20,
      textAlign: 'center',
    },
    list: {
      paddingBottom: 20,
      alignItems: 'center', // centraliza os itens da lista
    },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      width: 300, // largura fixa para centralizar melhor
      alignItems: 'center', // centraliza o conteúdo dentro do card
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    idText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#334155',
      textAlign: 'center',
    },
    modelText: {
      fontSize: 14,
      color: '#64748b',
      marginTop: 4,
      textAlign: 'center',
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

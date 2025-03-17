import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, BackHandler, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

// Defina o tipo Notification
interface Notification {
  id: string;
  title: string;
  description: string;
  link: string;
  note: string;
  read: boolean;
}

export default function HomeScreen() {
  const [name, setName] = useState('Usuário');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Função para salvar as notificações atualizadas
  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      console.log('Notificações salvas:', updatedNotifications);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  // Função para carregar notificações da AsyncStorage
  const loadNotificationsData = async () => {
    const storedNotifications = await AsyncStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
    }
  };

  // Carrega notificações ao focar na tela
  useFocusEffect(
    useCallback(() => {
      // Carrega as notificações sempre que a tela for acessada
      loadNotificationsData();  // Usa a função renomeada

      // Carrega o nome do usuário da AsyncStorage
      const fetchName = async () => {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setName(storedName);
        }
      };

      fetchName();

      const backAction = () => {
        Alert.alert("Sair do App", "Você realmente quer sair?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Sim",
            onPress: () => BackHandler.exitApp()
          }
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Remove o listener ao sair da tela
    }, [])
  );

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Bom dia";
    } else if (hours < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  const handleNameClick = () => {
    Alert.alert(
      "Deseja alterar seu nome?",
      "",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => router.push("/Screens/Hello") },
      ]
    );
  };

  // Marcar como lida e abrir link
  const handleNotificationPress = async (id: string, link?: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications); // Salva as notificações atualizadas

    if (link) {
      Linking.openURL(link); // Abre o link da notificação
    }

    router.push('/Screens/Notifications'); // Redireciona para a tela de notificações
  };

  const menuItems = [
    {
      id: 1,
      label: 'Calendário Acadêmico',
      icon: 'calendar-month' as const,
      onPress: () => {
        router.push("/Screens/Calendar");
        console.log('Academic Calendar');
      }
    },
    {
      id: 2,
      label: 'Bolsas e Estágios',
      icon: 'briefcase-account' as const,
      onPress: () => {
        router.push("/Screens/Bolsas");
        console.log('Scholarships');
      }
    },
    {
      id: 3,
      label: 'Cursos',
      icon: 'notebook-edit' as const,
      onPress: () => {
        router.push("/Screens/Cursos");
        console.log('Courses');
      }
    },
    {
      id: 4,
      label: 'Contatos',
      icon: 'email' as const,
      onPress: () => {
        router.push("/Screens/Contato");
        console.log('Contacts');
      }
    },
    {
      id: 5,
      label: 'Horários dos Ônibus',
      icon: 'clock' as const,
      onPress: () => {
        router.push("/Screens/Linha");
        console.log('Horários do Ônibus');
      }
    },
    {
      id: 6,
      label: 'Núcleos de Apoio',
      icon: 'account-group' as const,
      onPress: () => {
        router.push("/Screens/Nucleos");
        console.log('Núcleos de Apoio');
      }
    },
    {
      id: 7,
      label: 'Acesso ao QAcadêmico',
      icon: 'web' as const,
      onPress: () => {
        Linking.openURL("https://qacademico.ifpe.edu.br/");
        console.log('QAcadêmico Access');
      }
    },
    {
      id: 8,
      label: 'Requerimentos CRADT',
      icon: 'file-document-edit' as const,
      onPress: () => {
        Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSfny1cPy4j0pIMy1A8XL1mq9lf6ZoalVkhTpMwHdyjhQZhkAw/viewform");
        console.log('Forms');
      }
    },
    {
      id: 9,
      label: 'Setores',
      icon: 'office-building' as const,
      onPress: () => {
        router.push("/Screens/Setores");
        console.log('Departments');
      }
    },
    {
      id: 10,
      label: 'WhatsApp',
      icon: 'whatsapp' as const,
      onPress: () => {
        router.push("/Screens/Whats");
        console.log('WhatsApp');
      }
    },
    {
      id: 11,
      label: 'Serviço de Orientação Psicológica',
      icon: 'head-heart' as const,
      onPress: () => {
        console.log('Psychological Support');
        router.push("/Screens/Servico");
      }
    },
    {
      id: 12,
      label: 'FAQ',
      icon: 'help-circle' as const,
      onPress: () => router.push("/Screens/FAQ"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header com saudação e ícone de notificações */}
      <View style={styles.header}>
        <Text style={styles.greeting} onPress={handleNameClick}>
          {getGreeting()}, {name}!
        </Text>
        <Pressable onPress={() => router.push('/Screens/Notifications')} style={styles.notificationIcon}>
          <MaterialCommunityIcons
            name={notifications.some(notification => !notification.read) ? "bell" : "bell-outline"}
            size={28}
            color="#000"
          />
          {notifications.some(notification => !notification.read) && <View style={styles.notificationBadge} />}
        </Pressable>
      </View>

      {/* Menu de opções */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <Pressable style={styles.menuButton} onPress={item.onPress}>
            <MaterialCommunityIcons name={item.icon} size={66} color="white" />
            <Text style={styles.buttonText}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 16,
    paddingTop: 62,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    backgroundColor: 'red',
    borderRadius: 6,
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  menuButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#35672D',
    margin: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, BackHandler, Alert, ToastAndroid, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../context/NotificationsContext';  // Importando o hook do contexto
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth'; // Atualizado


export default function HomeScreen() {
  const [name, setName] = useState('Usuário');
  const { notifications, markAsRead, loadNotifications } = useNotifications(); // Acessando notificações e função de marcação
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const router = useRouter();

  // Função para verificar se há notificações não lidas
  const checkUnreadNotifications = () => {
    const unreadNotifications = notifications.some((notification) => !notification.read);
    setHasNewNotification(unreadNotifications);
  };

  // Carregar notificações ao focar na tela
  useFocusEffect(
    React.useCallback(() => {
      console.log("Tela focada - Carregando nome...");

      // Carregar o nome após um tempo
      const fetchName = async () => {
        const storedName = await AsyncStorage.getItem('userName');
        console.log("Nome armazenado: ", storedName);
        if (storedName) {
          setName(storedName);
        } else {
          console.log("Nenhum nome encontrado no AsyncStorage.");
        }
      };

      checkUnreadNotifications();
      fetchName();

      // Simula um atraso de 3 segundos para verificar as notificações
      const notificationTimeoutId = setTimeout(() => {
        loadNotifications();
        checkUnreadNotifications();
      }, 10000); // 10000 milissegundos (10 segundos)

      // Função para lidar com o botão de voltar
      const backAction = () => {
        Alert.alert("Sair do App", "Você realmente quer sair?", [
          { text: "Não", onPress: () => null, style: "cancel" },
          { text: "Sim", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };

      // Adicionando o listener de back press
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        console.log("Removendo listener de back press...");
        backHandler.remove(); // Remove o listener de back press
        clearTimeout(notificationTimeoutId); // Limpa o timeout de checkUnreadNotifications
      };
    }, [notifications]) // Recarregar sempre que as notificações mudarem
  );
  // Função de manipulação de notificações
  const handleNotificationClick = async () => {
    console.log("🖱️ Clicado no botão de notificação...");

    try {
      console.log("💾 Salvando status de leitura como 'true' no AsyncStorage...");
      await AsyncStorage.setItem('isNewNotification', 'false');
      setHasNewNotification(false); // Marca como lida
      console.log("✅ Status de leitura salvo com sucesso.");
    } catch (error) {
      console.error("❌ Erro ao armazenar status de notificação localmente: ", error);
    }

    console.log("🚀 Redirecionando para tela de notificações...");
    router.push('/Screens/Notifications');
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    console.log("Hora atual: ", hours);
    if (hours < 12) {
      return "Bom dia";
    } else if (hours < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  const handleNameClick = () => {
    console.log("Clicado no nome para alteração...");
    Alert.alert(
      "Deseja alterar seu nome?",
      "",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => router.push("/Screens/Hello") },
      ]
    );
  };

  // Verifica se o usuário está autenticado no momento do clique
  const checkAuthentication = () => {
    const auth = getAuth(); // Uso do Firebase Auth atualizado

    const user = auth.currentUser; // Obtém o usuário autenticado
    if (user) {
      // Se o usuário estiver autenticado, redireciona para outra tela
      router.push("/Screens/Notification/UpdateNotification"); // Altere o caminho para a tela desejada
    } else {
      // Se o usuário não estiver autenticado, vai para a tela de login
      router.push("/Screens/Login");
    }
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
      label: 'Carteira de Estudante',
      icon: 'card-account-details' as const,
      onPress: () => { ToastAndroid.show('A tela ainda não está pronta para ser visualizada', ToastAndroid.SHORT)},
    },
    {
      id: 13,
      label: 'FAQ',
      icon: 'help-circle' as const,
      onPress: () => router.push("/Screens/FAQ"),
    },
    {
      id: 14,
      label: 'Administrador',
      icon: 'account-lock' as const,
      onPress: checkAuthentication,
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header com saudação e ícone de notificações */}
      <View style={styles.header}>
        <Text style={styles.greeting} onPress={handleNameClick}>
          {getGreeting()}, {name}!
        </Text>
        <Pressable
          onPress={handleNotificationClick}
          style={styles.notificationIcon}
        >
          {hasNewNotification && <View style={styles.notificationBadge} />}
          <MaterialCommunityIcons name="bell" size={28} color="black" />
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

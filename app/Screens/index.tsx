import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, BackHandler, Alert, ToastAndroid, Linking, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../context/NotificationsContext';  // Importando o hook do contexto
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth'; // Atualizado
import Share from 'react-native-share';
import { RFValue } from "react-native-responsive-fontsize";
import DeviceInfo from 'react-native-device-info';
import { getFirestore, doc, getDoc, setDoc } from '@react-native-firebase/firestore';

export default function HomeScreen() {
  const [name, setName] = useState('Usuário');
  const { notifications, markAsRead, loadNotifications } = useNotifications(); // Acessando notificações e função de marcação
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const router = useRouter();
  const uniqueId = DeviceInfo.getUniqueId(); // ID exclusivo do dispositivo

  const handleShare = async () => {
    try {
      const message = `🎉 O Campus Connect é para TODOS! 📲
  
  Se você é aluno do campus, independentemente do seu curso, seja Administração, Logística, Qualidade ou qualquer outro. Sim, você pode baixar e usar o nosso app! 🚀✨
  
  🔗 Baixe o app agora mesmo: 
  https://drive.google.com/file/d/1qnnT8aKB82pP_gu0CuLFApVelYzWGzm7/view?usp=drive_link
  
  A equipe do Campus Connect agradece! 💚📚`;

      await Share.open({ message });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  // Função para verificar se há notificações não lidas
  const checkUnreadNotifications = () => {
    const unreadNotifications = notifications.some((notification) => !notification.read);
    setHasNewNotification(unreadNotifications);
  };


  const checkAppVersion = async () => {
    const currentVersion = DeviceInfo.getVersion();
    console.log('[Versão Atual]:', currentVersion);
  
    try {
      const lastCheckString = await AsyncStorage.getItem('lastVersionCheck');
  
      const now = new Date();
      const twelveHoursInMs = 12 * 60 * 60 * 1000;
  
      if (lastCheckString) {
        const lastCheckDate = new Date(lastCheckString);
        const diff = now.getTime() - lastCheckDate.getTime();

        console.log('[Última verificação]:', lastCheckDate.toLocaleString());
  
        if (diff < twelveHoursInMs) {
          console.log('[Verificação de versão já feita nas últimas 12 horas]');
          return;
        }
      }
  
      const db = getFirestore();
      const docRef = doc(db, 'app_version', 'current');
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists) {
        const data = docSnap.data();
        const latestVersion = data?.latest_version;
        const updateUrl = data?.update_url;
        const notes = data?.notes;
  
        console.log('[Versão mais recente no Firestore]:', latestVersion);
        console.log('[URL de atualização]:', updateUrl);
  
        if (latestVersion && currentVersion !== latestVersion) {
          Alert.alert(
            'Atualização disponível',
            `Sua versão do aplicativo é ${currentVersion} \n\nA versão mais recente é ${latestVersion} \n\nNotas de atualização: ${notes}`,
            [
              {
                text: 'Atualizar agora',
                onPress: () => {
                  if (updateUrl) Linking.openURL(updateUrl);
                }
              },
              {
                text: 'Lembrar novamente depois',
                style: 'cancel',
                onPress: async () => {
                  console.log('[Lembrar novamente em 12h]');
                  await AsyncStorage.setItem('lastVersionCheck', now.toISOString());
                }
              }
            ]
          );
        } else {
          console.log('[App está atualizado]');
          // Salva o horário da verificação só se estiver atualizado
          await AsyncStorage.setItem('lastVersionCheck', now.toISOString());
        }
      } else {
        console.log('[Documento não encontrado no Firestore]');
      }
    } catch (error) {
      console.error('[Erro ao verificar versão]:', error);
    }
  };  

  const saveUserIfNotExists = async () => {
    try {
      const db = getFirestore();
      const userId = await DeviceInfo.getUniqueId();
      const savedUserId = await AsyncStorage.getItem('@user_id');
      const isUserCreated = await AsyncStorage.getItem('@user_created'); // Verifica se o usuário já foi registrado no Firestore
  
      if (isUserCreated === 'true') {
        console.log('✅ O usuário', userId, 'já foi registrado no Firestore.');
        return;
      }
  
      if (savedUserId) {
        console.log('🆔 ID do usuário já salvo no AsyncStorage:', savedUserId);
  
        // Verifica se o usuário já existe no Firestore
        const userRef = doc(db, 'users', savedUserId);
        const docSnap = await getDoc(userRef);
  
        if (docSnap.exists) {
          console.log('✅ Usuário já existe no Firestore!');
          await AsyncStorage.setItem('@user_created', 'true'); // Marca o usuário como registrado
          return;
        } else {
          console.log('⚠️ Usuário no AsyncStorage, mas não existe no Firestore');
        }
      }
  
      // Se não houver ID salvo, ou se o ID no AsyncStorage não estiver no Firestore, cria um novo ID
      console.log('🆔 Novo ID gerado:', userId);
  
      // Salva o ID no AsyncStorage
      await AsyncStorage.setItem('@user_id', userId);
      console.log('📦 Novo ID registrado no AsyncStorage.');
  
      // Verifica se o usuário já existe no Firestore
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
  
      if (!docSnap.exists) {
        // Se não existir, cria o documento no Firestore
        await setDoc(userRef, {
          createdAt: new Date(),
          platform: DeviceInfo.getSystemName(),
          model: DeviceInfo.getModel(),
        });
        console.log('✅ Usuário salvo no Firestore!');
        await AsyncStorage.setItem('@user_created', 'true'); // Marca o usuário como registrado
      } else {
        console.log('⚠️ Usuário já existe no Firestore.');
      }
  
    } catch (error) {
      console.error('❌ Erro ao salvar/verificar usuário:', error);
    }
  };
  
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

      saveUserIfNotExists();
      fetchName();
      checkAppVersion();

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
      };
    }, [])
  );

  // Carregar notificações ao focar na tela
  useFocusEffect(
    React.useCallback(() => {

      checkUnreadNotifications();

      return () => {};
      
    }, [notifications]) // Recarregar sempre que as notificações mudarem
  );
  // Função de manipulação de notificações
  const handleNotificationClick = async () => {
    console.log("🖱️ Clicado no botão de notificação...");
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
      label: 'Cursos',
      icon: 'notebook-edit' as const,
      onPress: () => {
        router.push("/Screens/Cursos");
        console.log('Courses');
      }
    },
    {
      id: 3,
      label: 'Horários dos Ônibus',
      icon: 'bus-clock' as const,
      onPress: () => {
        router.push("/Screens/Linha");
        console.log('Horários do Ônibus');
      }
    },
    {
      id: 4,
      label: 'Horários das Aulas',
      icon: 'clock' as const,
      onPress: () => {
        router.push("/Screens/Aulas");
        console.log('Horários das aulas');
      }
    },
    {
      id: 5,
      label: 'WhatsApp',
      icon: 'whatsapp' as const,
      onPress: () => {
        router.push("/Screens/Whats");
        console.log('WhatsApp');
      }
    },
    {
      id: 6,
      label: 'Contatos',
      icon: 'email' as const,
      onPress: () => {
        router.push("/Screens/Contato");
        console.log('Contacts');
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
      label: 'Bolsas e Estágios',
      icon: 'briefcase-account' as const,
      onPress: () => {
        router.push("/Screens/Bolsas");
        console.log('Scholarships');
      }
    },
    {
      id: 10,
      label: 'Núcleos de Apoio',
      icon: 'account-group' as const,
      onPress: () => {
        router.push("/Screens/Nucleos");
        console.log('Núcleos de Apoio');
      }
    },
    {
      id: 11,
      label: 'Setores',
      icon: 'office-building' as const,
      onPress: () => {
        router.push("/Screens/Setores");
        console.log('Departments');
      }
    },
    {
      id: 12,
      label: 'Serviço de Orientação Psicológica',
      icon: 'head-heart' as const,
      onPress: () => {
        console.log('Psychological Support');
        router.push("/Screens/Servico");
      }
    },
    {
      id: 13,
      label: 'Carteira de Estudante',
      icon: 'card-account-details' as const,
      onPress: () => {
        console.log('Carteira de estudante');
        router.push("/Screens/Carteira");
      }
    },
    {
      id: 14,
      label: 'Portal Campus Igarassu',
      icon: require('./Menuindex/Logoif.png'), // Caminho correto para a imagem
      onPress: () => {
        Linking.openURL("https://portal.ifpe.edu.br/igarassu/");
        console.log('Portal');
      },
    },
    {
      id: 15,
      label: 'FAQ',
      icon: 'help-circle' as const,
      onPress: () => router.push("/Screens/FAQ"),
    },
    {
      id: 16,
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

        <View style={styles.headerIcons}>
          <Pressable onPress={handleShare} style={styles.iconButton}>
            <MaterialCommunityIcons name="share-variant" size={28} color="black" />
          </Pressable>

          <Pressable onPress={handleNotificationClick} style={styles.notificationIcon}>
            {hasNewNotification && <View style={styles.notificationBadge} />}
            <MaterialCommunityIcons name="bell" size={28} color="black" />
          </Pressable>
        </View>
      </View>


      {/* Menu de opções */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <Pressable style={styles.menuButton} onPress={item.onPress}>
            {typeof item.icon === 'string' ? (
              // Se for string, usa um ícone da biblioteca
              <MaterialCommunityIcons name={item.icon as any} size={RFValue(52)} color="white" />
            ) : (
              // Se não for string, renderiza uma imagem PNG
              <Image source={item.icon} style={{ width: RFValue(52), height: RFValue(52) }} resizeMode="contain" />
            )}
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
    fontSize: RFValue(20),
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
    fontSize: RFValue(16),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 12,
  },

});

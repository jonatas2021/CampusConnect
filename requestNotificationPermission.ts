import { Alert, Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const requestNotificationPermission = async () => {
  try {
    // Solicita permissão só se for Android 13+ ou iOS
    if (
      (Platform.OS === 'android' && Platform.Version >= 33) ||
      Platform.OS === 'ios'
    ) {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= 1) {
        console.log('Permissão concedida!');
      } else {
        console.warn('Permissão negada.');
      }
    }

    // Criação do canal em qualquer Android 8.0+ (API 26+)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default-channel-id',
        name: 'Notificações Gerais',
        importance: AndroidImportance.HIGH,
      });

      // Reforço para Android 13+: Solicita POST_NOTIFICATIONS diretamente
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Permissão de Notificação',
            message: 'Precisamos da sua permissão para enviar notificações importantes sobre o nosso aplicativo e o meio acadêmico.',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permissão de notificação negada no Android');
          Alert.alert(
            'Permissão de notificações negada',
            'O aplicativo não tem permissão para enviar notificações, então você não receberá avisos ou atualizações na área de notificações.\n\nIsso pode ter ocorrido porque a permissão foi negada.\n\nAtive a permissão manualmente nas configurações do sistema do seu celular, assim você passará a receber todas as notificações importantes.'
          );
        }
      }
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
  }
};


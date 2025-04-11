import { Alert, Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const requestNotificationPermission = async () => {
  try {
    // Android 13+ ou iOS
    if (
      (Platform.OS === 'android' && Platform.Version >= 33) ||
      Platform.OS === 'ios'
    ) {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= 1) {
        console.log('Permissão concedida!');

        // Criação do canal (apenas no Android)
        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'default-channel-id',
            name: 'Notificações Gerais',
            importance: AndroidImportance.HIGH,
          });
        }
      }

      // Reforço extra para Android (opcional)
      if (Platform.OS === 'android') {
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
            'Você não está recebendo notificações do aplicativo na área de notificações, mas não se preocupe, você pode ativar as notificações manualmente nas configurações do sistema.'
          );
          return;
        }
      }
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
  }
};

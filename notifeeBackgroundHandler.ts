// notifeeBackgroundHandler.ts
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('[onBackgroundEvent]', type, detail);

  if (type === EventType.PRESS && detail.notification?.data?.link) {
    console.log('Notificação de link tocada (em background):', detail.notification.data.link);
    // Você pode salvar em AsyncStorage, enviar evento, etc.
  }
});

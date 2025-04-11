// src/types/react-native-push-notification.d.ts
declare module 'react-native-push-notification' {
    interface NotificationOptions {
      channelId?: string;
      title?: string;
      message: string;
      data?: Record<string, any>;
      // Adicione mais campos conforme for usando
    }
  
    const PushNotification: {
      configure(config: {
        onRegister?: (token: any) => void;
        onNotification?: (notification: any) => void;
        popInitialNotification?: boolean;
        requestPermissions?: boolean;
      }): void;
  
      createChannel(
        channel: { channelId: string; channelName: string },
        callback: (created: boolean) => void
      ): void;
  
      localNotification(notification: NotificationOptions): void;
    };
  
    export default PushNotification;
  }
  
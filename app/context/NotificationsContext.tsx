// NotificationsContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, query, orderBy, getDocs } from '@react-native-firebase/firestore';

export interface Notification {
  id: string;
  title: string;
  note: string;
  description: string;
  link?: string;
  read: boolean;
}

interface NotificationsContextData {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  loadNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData>({} as NotificationsContextData);

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    try {
      const db = getFirestore();
      const notificationsQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(notificationsQuery);

      const storedNotifications = await AsyncStorage.getItem('notifications');
      const savedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

      const notificationsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const savedNotification = savedNotifications.find((n: Notification) => n.id === doc.id);

        return {
          id: doc.id,
          title: data.title,
          note: data.note,
          description: data.description,
          link: data.link,
          read: savedNotification ? savedNotification.read : false,
        };
      });

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const markAsRead = async (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);

    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, markAsRead, loadNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Alteração aqui para exportar como default
export default NotificationsProvider;

export const useNotifications = () => useContext(NotificationsContext);

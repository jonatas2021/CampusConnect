import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NotificationsProvider from '@/app/context/NotificationsContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Hello" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Questions" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Carousel" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/index" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Contato" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/BusSchedule/BusScheduleScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/BusSchedule/BusScheduleScreen2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Linha" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Calendar" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Support/ChatScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/FAQ" options={{ headerShown: false }} />
            {/* <Stack.Screen name="Screens/Ai/Chat" options={{ headerShown: false }} /> */}
            <Stack.Screen name="Screens/Nucleos" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Nucleos/Neabi" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Nucleos/Neged" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Nucleos/Napne" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Nucleos/N60+" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Nucleos/Nac" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Adm1" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Log1" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Gq1" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Ipi1" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Tsi1" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Adm2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Gq2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Ipi2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Log2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Cursos/Tsi2" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Setores" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Setores/Dapd" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Setores/Depex" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Setores/Den" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Setores/Cradt" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Estagio" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Extensao" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Manutencao" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Monitoria" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Pesquisa" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Bolsas/Tutoria" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Whats" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Whats/Groups" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Whats/Comunidades" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Whats/Contatos" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Servico" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Notifications" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Notification/CreateNotification" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Notification/UpdateNotification" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Notification/UserListScreen" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Login" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Aulas" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Carteira" options={{ headerShown: false }} />
            <Stack.Screen name="Screens/Carteirafree" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found"  />
          </Stack>
          <StatusBar style="dark" translucent />
        </ThemeProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}

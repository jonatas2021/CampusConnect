import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, ToastAndroid } from "react-native";

const CONTACTS_URL =
  "https://raw.githubusercontent.com/CaioSousa32/campus-connect-data/main/contatos.json";

const STORAGE_KEY = "@contacts_data";
const STORAGE_DATE_KEY = "@contacts_last_update";

export async function fetchContacts() {
  try {
    console.log("🔍 Verificando atualizações dos contatos...");

    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    const cachedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);

    const parsedCache = cachedData ? JSON.parse(cachedData) : null;

    const response = await fetch(CONTACTS_URL, {
       headers: { "Cache-Control": "no-cache" },
       });

    if (!response.ok) {
      console.log("⚠️ Falha ao baixar remoto — usando cache se disponível");
      if (parsedCache) return { data: parsedCache.Contacts ?? [], lastUpdate: cachedDate, fromCache: true };
      return { data: [], lastUpdate: null, fromCache: true };
    }

    const remoteData = await response.json();

    // comparar datas
    if (cachedDate && cachedDate === remoteData.lastUpdate) {
      console.log("✅ Nenhuma atualização — lastUpdate igual ao cache");
      return { 
        data: parsedCache?.Contacts ?? [], 
        lastUpdate: cachedDate, 
        fromCache: true 
      };
    }

    // salvar novo cache
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
    await AsyncStorage.setItem(STORAGE_DATE_KEY, remoteData.lastUpdate);

    console.log("📥 Atualização encontrada e salva");
    return { 
      data: remoteData.Contacts ?? [], 
      lastUpdate: remoteData.lastUpdate, 
      fromCache: false 
    };

  } catch (error) {
    console.error("❌ Erro ao carregar contatos:", error);

    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    const cachedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);

    if (cachedData) {
          console.log("📦 Sem internet — usando cache salvo");
      const parsed = JSON.parse(cachedData);
      return { data: parsed.Contacts ?? [], lastUpdate: cachedDate ?? null, fromCache: true };
    }
    
    // 📢 Sem internet E sem cache → avisar o usuário
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Sem conexão. Conecte-se à internet para carregar os contatos.",
        ToastAndroid.SHORT
      );
    }

    return { data: [], lastUpdate: null, fromCache: false };
  }
}

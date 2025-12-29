import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, ToastAndroid } from "react-native";

const BUS_URL =
  "https://raw.githubusercontent.com/CaioSousa32/campus-connect-data/main/bus_botafogo.json";

const STORAGE_KEY = "@bus_botafogo_data";
const STORAGE_DATE_KEY = "@bus_botafogo_last_update";

export async function fetchBusSchedule() {
  try {
    console.log("🔍 Verificando atualizações dos horários de ônibus...");

    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    const cachedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);

    const parsedCache = cachedData ? JSON.parse(cachedData) : null;

    const response = await fetch(BUS_URL, {
      headers: { "Cache-Control": "no-cache" },
    });

    if (!response.ok) {
      console.log("⚠️ Falha ao baixar remoto — usando cache se disponível");
      if (parsedCache)
        return {
          data: parsedCache,
          lastUpdate: cachedDate,
          fromCache: true,
        };

      return { data: [], lastUpdate: null, fromCache: true };
    }

    const remoteData = await response.json();

    // comparar datas
    if (cachedDate && cachedDate === remoteData.lastUpdate) {
      console.log("✅ Nenhuma atualização — lastUpdate igual ao cache");
      return {
        data: parsedCache ?? [],
        lastUpdate: cachedDate,
        fromCache: true,
      };
    }

    // salvar novo cache
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(remoteData.schedules)
    );
    await AsyncStorage.setItem(
      STORAGE_DATE_KEY,
      remoteData.lastUpdate
    );

    console.log("📥 Atualização encontrada e salva");
    return {
      data: remoteData.schedules ?? [],
      lastUpdate: remoteData.lastUpdate,
      fromCache: false,
    };

  } catch (error) {
    console.error("❌ Erro ao carregar horários de ônibus:", error);

    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    const cachedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);

    if (cachedData) {
      console.log("📦 Sem internet — usando cache salvo");
      return {
        data: JSON.parse(cachedData),
        lastUpdate: cachedDate ?? null,
        fromCache: true,
      };
    }

    // 📢 Sem internet E sem cache
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Sem conexão. Conecte-se à internet para carregar os horários.",
        ToastAndroid.SHORT
      );
    }

    return { data: [], lastUpdate: null, fromCache: false };
  }
}

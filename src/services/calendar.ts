import AsyncStorage from "@react-native-async-storage/async-storage";

const CALENDAR_URL =
  "https://raw.githubusercontent.com/CaioSousa32/campus-connect-data/main/calendar.json";

const STORAGE_KEY = "@calendar_data";
const STORAGE_DATE_KEY = "@calendar_last_update";

export const fetchCalendar = async () => {
  try {
    // 1️⃣ Tenta pegar do cache primeiro
    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    const cachedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);

    if (cachedData) {
      return {
        data: JSON.parse(cachedData),
        lastUpdate: cachedDate || null,
        fromCache: true,
      };
    }

    // 2️⃣ Caso não tenha cache → Buscar online
    const response = await fetch(CALENDAR_URL);
    const data = await response.json();

    const updateDate = new Date().toISOString(); // salva quando foi atualizado

    // 3️⃣ Salvar no cache
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(STORAGE_DATE_KEY, updateDate);

    return { data, lastUpdate: updateDate, fromCache: false };

  } catch (error) {
    console.error("Erro ao carregar calendário:", error);
    return null;
  }
};

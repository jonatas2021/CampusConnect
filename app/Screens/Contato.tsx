import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ToastAndroid, Image
} from "react-native";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import CopyButton from "@/components/svg/CopyButton";
import { fetchContacts } from "@/src/services/contatos"; // <-- seu arquivo contatos.ts

interface ContactProps {
  id: string;
  nome: string;
  email: string;
}

const EmailDocentes: React.FC = () => {
  const [contacts, setContacts] = useState<ContactProps[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(async () => {
      const result = await fetchContacts();

      if (result.data.length > 0) {
        setContacts(result.data);
        setLastUpdate(result.lastUpdate);
      } 
      setLoading(false);
    });
  }, []);

  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o app de email.");
    });
  };

  const handleCopyEmail = async (email: string) => {
    await Clipboard.setStringAsync(email);
    Alert.alert("Copiado!", "O email foi copiado para a área de transferência.");
  };

  if (loading) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Image source={require('../../assets/images/Loading.gif')} style={{width: '40%', height: '20%'}} resizeMode="contain"/>

      <Text style={{ marginTop: 20, fontSize: 18, color: "#2A5224" }}>
        Carregando calendário...
      </Text>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Email dos Docentes</Text>
      <View style={styles.separator} />
      <Text style={styles.lastUpdate}>
        Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleDateString("pt-BR") : "–"}
      </Text>

      <View style={styles.listContainer}>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.nome}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSendEmail(item.email)}
                >
                  <MaterialIcons name="email" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCopyEmail(item.email)}
                >
                  <CopyButton style={styles.copyButton} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "4%",
    paddingTop: "6%",
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    marginTop: "10%",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    marginBottom: 5,
  },
  lastUpdate: {
    fontSize: RFValue(12),
    color: "#888",
    textAlign: "right",
    marginBottom: 15,
  },
  listContainer: {
    backgroundColor: "#1B5E20",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flex: 1,
  },
  item: {
    backgroundColor: "#66BB6A",
    padding: "2%",
    borderRadius: 8,
    marginVertical: "1%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 55,
  },
  itemText: {
    fontSize: RFValue(14),
    color: "#000",
    fontWeight: "bold",
    flexShrink: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButton: {
    transform: [{ scale: 0.9 }],
  },
});

export default EmailDocentes;

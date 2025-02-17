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
} from "react-native";
import BackButton from "@/components/svg/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Clipboard from "@react-native-clipboard/clipboard";

// Importa os dados do arquivo JSON na raiz do projeto
const docentesData = require("../../docentes.json");

const EmailDocentes = () => {
  const router = useRouter(); // CORRETO: useRouter() dentro do componente
  const [docentes, setDocentes] = useState(docentesData); // Inicializa o estado com os dados do JSON

  const backToIndex = () => {
    router.push("/screens");
  };

  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o app de email.");
    });
  };

  const handleCopyEmail = (email: string) => {
    Clipboard.setString(email);
    Alert.alert("Copiado!", "O email foi copiado para a área de transferência.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backArrowContainer}>
        <TouchableOpacity style={styles.backArrow} onPress={backToIndex}>
          <BackButton width={25} height={25} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Email dos Docentes</Text>
      <View style={styles.separator} />
      <Text style={styles.lastUpdate}>Última atualização: 07/02/2025</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={docentes}
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
                  <Feather name="copy" size={30} color="#fff" />
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
    paddingHorizontal: "4%", // Evita margens laterais excessivas
    paddingTop: "6%",
  },
  backArrowContainer: {
    position: "absolute",
    top: "6%",
    left: "3%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DEFCC7",
  },
  backArrow: {
    zIndex: 2,
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
    flex: 1, // Permite que a lista ocupe todo o espaço disponível
  },
  item: {
    backgroundColor: "#66BB6A",
    padding: "2%",
    borderRadius: 8,
    marginVertical: "1%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", // Garante que o item não ultrapasse a tela
  },
  itemText: {
    fontSize: RFValue(14),
    color: "#000",
    fontWeight: "bold",
    flexShrink: 1, // Faz o texto quebrar linha em vez de vazar
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
});

export default EmailDocentes;

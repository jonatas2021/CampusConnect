import React, { useState } from "react";
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
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import docentesData from "@/docentes.json";

const EmailDocentes = () => {
  const [docentes] = useState(docentesData);
      
  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o app de email.");
    });
  };

  const handleCopyEmail = async (email: string) => {
    await Clipboard.setStringAsync(email);
    Alert.alert("Copiado!", "O email foi copiado para a área de transferência.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
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
});

export default EmailDocentes;

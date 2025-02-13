import React from "react";
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

const docentes = [
    { id: "1", nome: "Prof. Alexandre Magno", email: "alexandre.oliveira@igarassu.ifpe.edu.br" },
    { id: "2", nome: "Profa. Alexandre Strapação", email: "alexandre.vianna@igarassu.ifpe.edu.br" },
    { id: "3", nome: "Prof. Allan Diego", email: "allan.lima@igarassu.ifpe.edu.br" },
    { id: "4", nome: "Profa. Ana C. Medeiros", email: "ana.medeiros@igarassu.ifpe.edu.br" },
    { id: "5", nome: "Profa. Ana C. Lemos", email: "ana.lemos@igarassu.ifpe.edu.br" },
    { id: "6", nome: "Prof. Anderson Carlos", email: "anderson.oliveira@igarassu.ifpe.edu.br" },
    { id: "7", nome: "Profa. Andreza Cordeiro", email: "andreza.cordeiro@igarassu.ifpe.edu.br" },
    { id: "8", nome: "Prof. Bruno Rios", email: "bruno.monteiro@igarassu.ifpe.edu.br" },
    { id: "9", nome: "Prof. Cícero Raimundo", email: "cicero.junior@igarassu.ifpe.edu.br" },
    { id: "10", nome: "Prof. Danniel Cláudio", email: "danniel.araujo@igarassu.ifpe.edu.br" },
    { id: "11", nome: "Prof. David Mota", email: "david.cavalcanti@igarassu.ifpe.edu.br" },
    { id: "12", nome: "Prof. Djalma Rangel", email: "djalma.rangel@igarassu.ifpe.edu.br" },
    { id: "13", nome: "Profa. Edilene Félix", email: "edilene.santos@igarassu.ifpe.edu.br" },
    { id: "14", nome: "Profa. Emaú Florêncio", email: "emaur.oliveira@igarassu.ifpe.edu.br" },
    { id: "15", nome: "Prof. Erton Vieira", email: "erton.silva@igarassu.ifpe.edu.br" },
    { id: "16", nome: "Profa. Flora Magna", email: "flora.vilar@igarassu.ifpe.edu.br" },
    { id: "17", nome: "Prof. Francisco Chaves", email: "francisco.pinto@igarassu.ifpe.edu.br" },
    { id: "18", nome: "Prof. Gustavo Boudoux", email: "gustavo.melo@igarassu.ifpe.edu.br" },
    { id: "19", nome: "Prof. Gustavo Nóbrega", email: "gustavo.martins@igarassu.ifpe.edu.br" },
    { id: "20", nome: "Prof. Hugo Dantas", email: "hugo.dantas@igarassu.ifpe.edu.br" },
    { id: "21", nome: "Profa. Inêz Manuele", email: "inez.santos@igarassu.ifpe.edu.br" },
    { id: "22", nome: "Prof. Ivo Félix", email: "ivo.gualberto@igarassu.ifpe.edu.br" },
    { id: "23", nome: "Prof. José Tarcisio", email: "jose.magalhaes@igarassu.ifpe.edu.br" },
    { id: "24", nome: "Profa. Liliane Alves", email: "liliane.sales@igarassu.ifpe.edu.br" },
    { id: "25", nome: "Prof. Lincoln Tavares", email: "lincoln.santos@igarassu.ifpe.edu.br" },
    { id: "26", nome: "Prof. Luiz Henrique", email: "luiz.martins@igarassu.ifpe.edu.br" },
    { id: "27", nome: "Profa. Mari Tania", email: "mari.soares@igarassu.ifpe.edu.br" },
    { id: "28", nome: "Profa. Michelle Cedraz", email: "michelle.oliveira@igarassu.ifpe.edu.br" },
    { id: "29", nome: "Prof. Milton Secundino", email: "milton.junior@igarassu.ifpe.edu.br" },
    { id: "30", nome: "Prof. Ramon Mota", email: "ramon.farias@igarassu.ifpe.edu.br" },
    { id: "31", nome: "Prof. Ranieri Valença", email: "ranieri.carvalho@igarassu.ifpe.edu.br" },
    { id: "32", nome: "Profa. Renata Queiroz", email: "renata.costa@igarassu.ifpe.edu.br" },
    { id: "33", nome: "Prof. Roberto Cahú", email: "roberto.cahu@igarassu.ifpe.edu.br" },
    { id: "34", nome: "Prof. Rodrigo Leite", email: "rodrigo.araujo@igarassu.ifpe.edu.br" },
    { id: "35", nome: "Profa. Simonelle Wivian", email: "simonelle.nascimento@igarassu.ifpe.edu.br" },
    { id: "36", nome: "Prof. Willyans Coelho", email: "willyans.coelho@igarassu.ifpe.edu.br" },
    { id: "37", nome: "Prof. Yuri Tietre", email: "yuri.araujo@igarassu.ifpe.edu.br" }
    
];

const EmailDocentes = () => {
  const router = useRouter(); // CORRETO: useRouter() dentro do componente

  const backToCarousel = () => {
    router.push("/screens/Carousel");
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
        <TouchableOpacity style={styles.backArrow} onPress={backToCarousel}>
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
        paddingHorizontal: '4%', // Evita margens laterais excessivas
        paddingTop: '6%',
  },
  backArrowContainer: {
    position: "absolute",
    top: "4%",
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
    marginTop: '10%'
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
    padding: '2%',
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

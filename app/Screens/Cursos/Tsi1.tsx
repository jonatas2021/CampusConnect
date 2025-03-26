import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";

const Tsi1 = () => {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tecnologia em Sistemas para Internet</Text>
      </View>

      <View style={styles.separator} />

      {/* Meia bola verde */}
      <View style={styles.halfCircle}>
        <Text style={styles.title2}>O que você procura?</Text>
      </View>

      {/* Informações sobre o curso */}
      <View style={styles.containerButton}>
        <Text style={styles.description}>
          O curso de Tecnologia em Sistemas para Internet (TSI) forma profissionais 
          capacitados para projetar, desenvolver e gerenciar sistemas e aplicações 
          para web e dispositivos móveis. O curso inclui disciplinas de 
          programação, banco de dados, segurança, design e experiência do usuário.
        </Text>

        {/* Duração e requisitos */}
        <Text style={styles.requirements}>
          Duração: 6 períodos (3 anos); {"\n"}
          Para concluir o curso, é necessário:{"\n"}
          • Cursar 3 disciplinas optativas;{"\n"}
          • Ter 60h de Prática Profissional.{"\n"}
          • Realizar a defesa do Trabalho de Conclusão de Curso (TCC).{"\n"} 
        </Text>

        {/* Botões */}
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => router.push("/Screens/Cursos/Tsi2")}
        >
          <Text style={styles.buttonText}>Disciplinas e Ementas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => Linking.openURL("https://drive.google.com/file/d/1AGbU8u1sAl56WXVPjt3FPDdwfr1pApfm/view?usp=drive_link")}
        >
          <Text style={styles.buttonText}>Matriz Curricular do curso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "4%",
    paddingTop: "6%",
  },
  halfCircle: {
    top: 0,
    width: "50%",
    height: 100,
    backgroundColor: "#2A5224",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    marginBottom: 30,
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    marginTop: "10%",
  },
  titleContainer: {
    width: "80%",
    alignSelf: "center",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
  },
  title2: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: 'center',
  },
  description: {
    fontSize: RFValue(14),
    textAlign: "justify",
    color: "#333",
    marginBottom: 10,
    lineHeight: 20,
  },
  requirements: {
    fontSize: RFValue(14),
    color: "#2A5224",
    fontWeight: "bold",
    marginBottom: 15,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: "6%",
    borderRadius: 5,
    marginVertical: "3%",
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#92C36B"
  },
  buttonText: {
    color: "#000",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  containerButton: {
    width: "100%",
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default Tsi1;

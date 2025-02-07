import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import BackButton from "../components/svg/BackButton";
import QuestionScreenImage from "../components/svg/QuestionScreenImage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RFValue } from 'react-native-responsive-fontsize';

export default function Questions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [response, setResponse] = useState<string | null>(null);

  const backToCarousel = () => {
    router.push("/Carousel");
  };

  const handleResponse = (answer: string) => {
    setResponse(answer);
    router.push('/Hello');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
       
        {/* Back Arrow with Circle */}
        <View style={styles.backArrowContainer}>
          <TouchableOpacity style={styles.backArrow} onPress={backToCarousel}>
            <BackButton width={25} height={25} />
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View style={styles.imageContainer}>
          <QuestionScreenImage />
        </View>

        {/* Title */}
        <Text style={styles.title}>Você é aluno do campus?</Text>

        {/* Description */}
        <Text style={styles.description}>
          Fique tranquilo, estamos coletando essas informações apenas para
          melhorar a sua experiência no nosso sistema.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.noButton]}
            onPress={() => handleResponse("Não")}
          >
            <Text style={styles.buttonText}>Não</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.yesButton]}
            onPress={() => handleResponse("Sim")}
          >
            <Text style={styles.buttonText}>Sim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backArrowContainer: {
    position: "absolute",
    top: "4%",
    left: "3%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "11%", // Define o tamanho do círculo
    height: "5%", // Define o tamanho do círculo
    borderRadius: '50%', // Garante que fique circular
    backgroundColor: "#DEFCC7", // Cor de fundo com transparência
  },
  backArrow: {
    zIndex: 2, // Mantém a seta sobre a bola
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
    padding: "4%"
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#3C3939",
  },
  description: {
    fontSize: RFValue(12),
    textAlign: "left",
    color: "#3C3939",
    marginVertical: "8%",
    marginHorizontal: "15%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "12%",
    padding: "4%"
  },
  button: {
    flex: 1,
    marginHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 10,
    alignItems: "center",
  },
  noButton: {
    backgroundColor: "#2A5A06",
  },
  yesButton: {
    backgroundColor: "#2A5A06",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: RFValue(12),
    fontWeight: "bold",
  },
});

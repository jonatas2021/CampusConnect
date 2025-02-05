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
import { useRouter } from "expo-router";

export default function Questions() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);

  const backToHello = () => {
    router.push("/Hello");
  };

  const handleResponse = (answer: string) => {
    setResponse(answer);
    router.push('/Carousel');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Back Arrow Placeholder */}
        <TouchableOpacity style={styles.backArrow} onPress={backToHello}>
          <BackButton width={25} height={25} />
        </TouchableOpacity>

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
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  backArrow: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1,
  },
  backText: {
    fontSize: 18,
    color: "#000000",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#3C3939",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#3C3939",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React from "react";
import useQuestionsLogic from "@/hooks/useQuestionsLogic";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import BackButton from "@/components/BackButton";
import QuestionScreenImage from "@/components/svg/QuestionScreenImage";
import { RFValue } from 'react-native-responsive-fontsize';

export default function Questions() {
  const { handleResponse } = useQuestionsLogic();

  return (
    <SafeAreaView style={styles.container}>
      <BackButton destination="/Screens/Carousel" />
      <View style={styles.content}>
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
    paddingHorizontal: "4%",
    paddingTop: "6%",
  },
  content: {
    flex: 1,
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

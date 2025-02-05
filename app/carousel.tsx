import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import Carousel from "../components/ui/Carousel";
import { useRouter } from "expo-router";
import BackButton from "../components/svg/BackButton";

const carouselData = [
  {
    id: "1",
    title: "Conheça seu curso!",
    description:
      "Veja todas as disciplinas do seu curso, aqui você também pode encontrar as referências de livros e filmes de cada uma disciplina.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem01").default,
  },
  {
    id: "2",
    title: "Preencha formulários!",
    description:
      "Veja todas as disciplinas do seu curso, aqui você também pode encontrar as referências de livros e filmes de cada uma disciplina.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem02").default,
  },
  {
    id: "3",
    title: "Saiba os hórarios do ônibus!",
    description:
      "Veja todas as disciplinas do seu curso, aqui você também pode encontrar as referências de livros e filmes de cada uma disciplina.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem03").default,
  },
];

const CarouselPage = () => {
  const router = useRouter();
  const [isLastSlide, setIsLastSlide] = useState(false);

  const backToQuestions = () => {
    router.push("/Questions");
  };

  const handleButtonPress = () => {
    router.push("/Questions");
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View>
        <TouchableOpacity style={styles.backArrow} onPress={backToQuestions}>
          <BackButton width={25} height={25} />
        </TouchableOpacity>
      </View>

      <Carousel data={carouselData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#DFFFD6",
  },
  backArrow: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 10,
    padding: 20,
  },
  finalButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#2A5A06",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CarouselPage;

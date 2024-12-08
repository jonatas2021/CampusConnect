import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native";
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

  const backToQuestions = () => {
    router.push("/questions");
  };
  return (
    <SafeAreaView style={styles.rootContainer}>
      <View >
        {/* Back Arrow Placeholder */}
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
});

export default CarouselPage;

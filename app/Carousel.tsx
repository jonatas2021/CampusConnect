import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import Carousel from "../components/ui/Carousel";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackButton from "../components/svg/BackButton";

const carouselData = [
  {
    id: "1",
    title: "O que é o Campus Connect?",
    description:
      "Nosso objetivo é reduzir a desinformação sobre processos burocráticos e centralizar a divulgação de informações essenciais para a vida acadêmica.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem01").default,
  },
  {
    id: "2",
    title: "Conheça seu curso!",
    description:
      "Veja todas as disciplinas do seu curso, aqui você também pode encontrar as referências de livros e filmes de cada uma disciplina.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem02").default,
  },
  {
    id: "3",
    title: "Preencha formulários!",
    description:
      "Acesse horários das disciplinas e o calendário acadêmico com datas importantes, como matrícula, feriados e início de semestres.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem03").default,
  },
  {
    id: "4",
    title: "Saiba os horários do ônibus!",
    description:
      "Planeje seu transporte com facilidade! Aqui você encontra os horários atualizados dos ônibus para chegar ao campus no momento certo.",
    backgroundColor: "#DFFFD6",
    image: require("../components/svg/CarouselItem04").default,
  },
];

const CarouselPage = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.rootContainer}>
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
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CarouselPage;

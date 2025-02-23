import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Carousel from "@/components/ui/Carousel";

// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/CarouselItem01";
import CarouselItem02 from "@/components/svg/CarouselItem02";
import CarouselItem03 from "@/components/svg/CarouselItem03";
import CarouselItem04 from "@/components/svg/CarouselItem04";

const carouselData = [
  {
    id: "1",
    title: "O que é o Campus Connect?",
    description:
      "Nosso objetivo é reduzir a desinformação sobre processos burocráticos e centralizar a divulgação de informações essenciais para a vida acadêmica.",
    backgroundColor: "#DFFFD6",
    image: CarouselItem01, // Passando o componente diretamente
  },
  {
    id: "2",
    title: "Conheça seu curso",
    description:
      "Veja todas as disciplinas do seu curso, aqui você também pode encontrar as referências de livros e filmes de cada uma disciplina.",
    backgroundColor: "#DFFFD6",
    image: CarouselItem02,
  },
  {
    id: "3",
    title: "Hórarios e Calendário Acadêmico",
    description:
      "Acesse horários das disciplinas e o calendário acadêmico com datas importantes, como matrícula, feriados e início de semestres.",
    backgroundColor: "#DFFFD6",
    image: CarouselItem03,
  },
  {
    id: "4",
    title: "Saiba os horários do ônibus",
    description:
      "Planeje seu transporte com facilidade! Aqui você encontra os horários atualizados dos ônibus para chegar ao campus no momento certo.",
    backgroundColor: "#DFFFD6",
    image: CarouselItem04,
  },
];

const CarouselPage = () => {

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
});

export default CarouselPage;

import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselServico";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";

// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Servico/Servico";
import CarouselItem02 from "@/components/svg/Servico/ServicoText";

const carouselData = [
    {
        id: "1",
        title: "O que é o Serviço de Orientação Psicológica?",
        description:
            "O serviço de orientação psicológica tem como objetivo oferecer suporte aos estudantes no enfrentamento de desafios emocionais, sociais e acadêmicos, promovendo seu bem-estar e desenvolvimento integral.",
        backgroundColor: "#DFFFD6",
        image: CarouselItem01,
        email: "" 
    },
    {
        id: "2",
        title: "Para mais informações:",
        description: "",
        backgroundColor: "#DFFFD6",
        image: CarouselItem02,
        email: "maria.almeida@igarassu.ifpe.edu.br"
    },
];

const CarouselPage = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.titleContainer}>
            <Text style={styles.title}>Serviço de Orientação Psicológica </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.rootContainer}>
                <Carousel
                    data={carouselData}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DFFFD6",
        paddingTop: "6%",
    },
    rootContainer: {
        flex: 1,
        backgroundColor: "#DFFFD6",
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
        alignSelf: "center"
    },
    separator: {
        width: "90%",
        height: 2,
        backgroundColor: "#000",
        alignSelf: "center",
    },
});

export default CarouselPage;

import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselSetores";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";

// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Setores/Dapd";
import CarouselItem02 from "@/components/svg/Setores/DapdText";

const carouselData = [
    {
        id: "1",
        title: "O que é a DAPD?",
        description:
            "A Diretoria de Articulação Pedagógica e Desenvolvimento (DAPD) do IFPE Campus Igarassu gerencia programas de tutoria e apoio acadêmico, auxiliando estudantes e promovendo ações educacionais.",
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
        email: "info@ifpe.edu.br" // ➡️ Adicionando email
    },
];

const CarouselPage = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>DAPD</Text>
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
    separator: {
        width: "90%",
        height: 2,
        backgroundColor: "#000",
        alignSelf: "center",
    },
});

export default CarouselPage;

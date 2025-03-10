import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselSetores";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";

// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Setores/Cradt";
import CarouselItem02 from "@/components/svg/Setores/CradtText";

const carouselData = [
    {
        id: "1",
        title: "O que é a CRADT?",
        description:
            "A Coordenação de Registros Acadêmicos, Diplomação e Turnos (CRADT) do IFPE Campus Igarassu atua como secretaria escolar, oferecendo suporte à comunidade acadêmica e ao público externo.",
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
        email: "cradt@igarasu.ifpe.edu.br" // ➡️ Adicionando email
    },
];

const CarouselPage = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>CRADT</Text>
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

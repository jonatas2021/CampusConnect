import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking } from "react-native";
import Carousel from "@/components/ui/CarouselNucleos";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";



// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Neged";
import CarouselItem02 from "@/components/svg/NegedText";

const carouselData = [
    {
        id: "1",
        title: " O que é o NEGED?",
        description:
            "é um espaço de reflexão, pesquisa e ação que busca promover a equidade de gênero e a valorização da diversidade. Suas atividades incluem debates, formações, campanhas de conscientização e projetos voltados para a inclusão e o respeito às identidades de gênero e orientações sexuais.",
        backgroundColor: "#DFFFD6",
        image: CarouselItem01, // Passando o componente diretamente
    },
    {
        id: "2",
        title: "Para mais informações :",
        description:
            "",
        backgroundColor: "#DFFFD6",
        image: CarouselItem02,
    },
];

const CarouselPage = () => {
    const router = useRouter();

    const handleButtonPressR = () => {
        Linking.openURL("https://drive.google.com/seu-link-aqui");
    };

    const handleButtonPressP = () => {
        Linking.openURL("https://drive.google.com/seu-link-aqui");
    };
    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>NEABI</Text>
            <View style={styles.separator} />
            <View style={styles.rootContainer}>
                <Carousel 
                data={carouselData} 
                onButtonPressR={handleButtonPressR}
                onButtonPressP={handleButtonPressP}
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
        alignSelf: 'center',
    },
});

export default CarouselPage;

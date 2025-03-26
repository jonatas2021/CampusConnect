import React from "react";
import { StyleSheet, SafeAreaView, View, Text,Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselBolsas";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";


// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Bolsas/Extensao";
import CarouselItem02 from "@/components/svg/Bolsas/ExtensaoText";

const carouselData = [
    {
        id: "1",
        title: "Sobre a Extensão:",
        description:
            "A Extensão no IFPE Campus Igarassu fortalece a relação entre a instituição e a comunidade por meio de ações educativas, culturais e sociais. Lembre-se de ter uma ideia e buscar um orientador.",
        backgroundColor: "#DFFFD6",
        image: CarouselItem01, // Passando o componente diretamente
    },
    {
        id: "2",
        title: "Para mais informações:",
        description: "",
        backgroundColor: "#DFFFD6",
        image: CarouselItem02,
    },
];

const CarouselPage = () => {
    const router = useRouter();

    const handleButtonPressE = () => {
        Linking.openURL("https://portal.ifpe.edu.br/wp-content/uploads/repositoriolegado/portal/documentos/edital-integrado-de-pesquisa-e-extensao-n-1_2020_gr_ifpe-final.pdf");
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Extensão</Text>
            <View style={styles.separator} />
            <View style={styles.rootContainer}>
                <Carousel
                    data={carouselData}
                    onButtonPressE={handleButtonPressE}
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

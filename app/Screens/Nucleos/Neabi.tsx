import React from "react";
import { StyleSheet, SafeAreaView, View, Text,Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselNucleos";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";


// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Nucleos/Neabi";
import CarouselItem02 from "@/components/svg/Nucleos/NeabiText";

const carouselData = [
    {
        id: "1",
        title: "O que é o NEABI?",
        description:
            "É um núcleo de promoção, planejamento e execução de políticas inclusivas pautado na construção da cidadania por meio da valorização da identidade étnico-racial, do respeito às diferenças e à igualdade de oportunidades, que venha a eliminar as barreiras atitudinais.",
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

    const handleButtonPressR = () => {
        Linking.openURL("https://portal.ifpe.edu.br/wp-content/uploads/repositoriolegado/portal/documentos/regulamento-neabi-1.pdf");
    };

    const handleButtonPressP = () => {
        Linking.openURL("https://drive.google.com/file/d/1Fr6ia8dbpxSEsQ7bW7er_APtZuWcIr6h/view?usp=drive_link");
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

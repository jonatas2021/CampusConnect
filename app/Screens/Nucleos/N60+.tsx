import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselNucleos";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";



// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Nucleos/N60+";
import CarouselItem02 from "@/components/svg/Nucleos/N60+Text";

const carouselData = [
    {
        id: "1",
        title: "O que é o 60+ ?",
        description:
            "É um espaço dedicado ao apoio, valorização e inclusão de pessoas idosas. Suas ações visam promover o envelhecimento ativo, o bem-estar e a participação social por meio de atividades educativas, culturais e intergeracionais.",
        backgroundColor: "#DFFFD6",
        image: CarouselItem01, // Passando o componente diretamente
    },
    {
        id: "2",
        title: "Para mais informações:",
        description:
            "",
        backgroundColor: "#DFFFD6",
        image: CarouselItem02,
    },
];

const CarouselPage = () => {
    const router = useRouter();

    const handleButtonPressR = () => {
        Linking.openURL("https://portal.ifpe.edu.br/wp-content/uploads/2023/10/Resolucao-112-2022-Aprova-o-Regulamento-do-Nucleo-60-do-IFPE-1.pdf");
    };

    const handleButtonPressP = () => {
        ToastAndroid.show("Este núcleo ainda não está ativo em nosso campus.", ToastAndroid.SHORT);
    };
    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>N60+</Text>
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

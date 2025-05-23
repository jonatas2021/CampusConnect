import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Linking, ToastAndroid } from "react-native";
import Carousel from "@/components/ui/CarouselNucleos";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";
import { useRouter } from "expo-router";



// Importação direta dos componentes SVG
import CarouselItem01 from "@/components/svg/Nucleos/Nac";
import CarouselItem02 from "@/components/svg/Nucleos/NacText";

const carouselData = [
    {
        id: "1",
        title: "O que é o NAC?",
        description:
            "É um espaço voltado à promoção e valorização das diversas manifestações culturais e artísticas. Seu objetivo é fomentar a produção e a difusão da arte, proporcionando experiências culturais que envolvam a comunidade acadêmica e externa. O núcleo organiza atividades, eventos, exposições e oficinas.",
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
        Linking.openURL("https://portal.ifpe.edu.br/o-ifpe/extensao/arte-e-cultura/");
    };

   const handleButtonPressP = () => {
        Linking.openURL("https://drive.google.com/file/d/1C2m1qSj9GyPgoPds25N7GBcl-gcbAma5/view?usp=drive_link");
    };
    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <Text style={styles.title}>NAC</Text>
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

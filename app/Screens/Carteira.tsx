import React from "react";
import { View, Text, StyleSheet, Linking, ImageBackground, Image, SafeAreaView, ScrollView, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton2";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";

const Carteira = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeContainer}>
            <BackButton />
            <Text style={styles.title}>Carteira de estudante</Text>
            <View style={styles.separator} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Descrição */}
                <View style={styles.descricaoview}>
                    <ImageBackground
                        source={require('./Carteira/Imagens/fundodescricao.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                        <Text style={styles.descricaotext}>Guia Prático: Como tirar sua carteirinha de estudante?</Text>
                    </ImageBackground>
                </View>

                {/* Imagem da Carteira */}
                <View style={styles.imagemview}>
                    <Image
                        source={require('./Carteira/Imagens/carteira.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    />
                </View>

                {/* Descrição da Carteira */}
                <View style={styles.descricaocarteiraview}>
                    <Text style={styles.descricaocarteiratext}>
                        Acesse o site e preencha o formulário com seus dados e os da sua instituição de ensino.
                    </Text>
                </View>

                {/* Botões */}
                <View style={styles.containerButton}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.5}
                        onPress={() => Linking.openURL("https://www.documentodoestudante.com.br/")}
                    >
                        <Text style={styles.buttonText}>Site para cursos superiores</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.5}
                        onPress={() => Linking.openURL("https://www.granderecife.pe.gov.br/servicos/carteira-de-identificacao-estudantil/#toggle-id-11-closed")}
                    >
                        <Text style={styles.buttonText}>Site para cursos técnicos</Text>
                    </TouchableOpacity>
                </View>

                {/* Última descrição */}
                <View style={styles.descricaositeview}>
                    <Text style={styles.descricaocarteiratext}>
                        Envie uma foto sua e o comprovante de matrícula. Tudo online, sem burocracia.
                    </Text>
                </View>

                <View style={styles.setasview}>
                    <Image
                        source={require('./Carteira/Imagens/setas.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.descricaositeview}>
                    <Text style={styles.descricaopagamentotext}>
                        Pague a taxa de emissão e pronto! Sua carteirinha estará pronta para ser retirada ou entregue na sua casa.
                    </Text>
                </View>

                <View style={styles.pagamentoview}>
                    <Image
                        source={require('./Carteira/Imagens/pagamento.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.descricaositeview}>
                    <Text style={styles.descricaopagamentotext}>
                    Se você possui o ID Jovem, tem direito à emissão gratuita da carteirinha.
                    </Text>
                </View>

                <View style={styles.containerButton2}>
                <ImageBackground
                        source={require('./Carteira/Imagens/efeito.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                    <TouchableOpacity
                        style={styles.button2}
                        activeOpacity={0.5}
                        onPress={() => ToastAndroid.show('A tela ainda não está pronta para ser visualizada', ToastAndroid.SHORT)}
                    >
                        <Text style={styles.buttonText}>Saiba mais</Text>
                    </TouchableOpacity>
                    </ImageBackground>

                </View>

                <View style={styles.containerButton3}>
                    <TouchableOpacity
                        style={styles.button3}
                        activeOpacity={0.5}
                        onPress={() => router.push("/Screens")}
                    >
                        <Text style={styles.buttonText2}>Volte para o inicio</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#DEFCC7",
        paddingTop: "6%",
    },
    scrollContainer: {
        alignItems: 'center'
    },
    descricaoview: {
        marginTop: 10,
        width: "100%",
        height: 90,
        alignSelf: 'center',
        alignItems: 'center',
    },
    imagens: {
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        width: "100%",
    },
    descricaotext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
        width: "60%"
    },
    imagemview: {
        width: "100%",
        height: 300,
        alignSelf: 'center',
        alignItems: 'center',
    },
    descricaocarteiraview: {
        width: "80%",
        alignSelf: 'center',
        alignItems: 'center',
    },
    descricaocarteiratext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
        marginBottom: 10
    },
    descricaositeview: {
        width: "75%",
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    setasview: {
        width: "100%",
        height: 80,
        alignSelf: 'center',
        alignItems: 'center',
    },
    descricaopagamentotext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
        width: "100%",
        marginTop: 20,
        marginBottom: 20
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
        alignSelf: 'center'
    },
    button: {
        width: "90%",
        paddingVertical: "3%",
        borderRadius: 5,
        marginVertical: "1%",
        borderWidth: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#2A5224"
    },
    buttonText: {
        color: "#fff",
        fontSize: RFValue(14),
        fontWeight: "bold",
    },
    containerButton: {
        width: "100%",
        alignSelf: 'center',
        marginVertical: "2%",
    },
    pagamentoview: {
        width: "100%",
        height: 320,
        alignSelf: 'center',
        alignItems: 'center',
    },
    button2: {
        width: "100%",
        paddingVertical: "5%",
        paddingHorizontal: "10%",
        borderRadius: 5,
        marginTop: '25%',
        borderWidth: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#2A5224",
    },
    containerButton2: {
        width: "55%",
        height: 110,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },    
    button3: {
        width: "100%",
        paddingVertical: "3%",
        paddingHorizontal: "10%",
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#92C36B",
    },
    containerButton3: {
        width: "100%",
        alignSelf: 'center',
        marginVertical: "14%",
        alignItems: 'center',
        justifyContent: 'center',
    },  
    buttonText2: {
        color: "#000",
        fontSize: RFValue(14),
        fontWeight: "bold",
    },
});

export default Carteira;

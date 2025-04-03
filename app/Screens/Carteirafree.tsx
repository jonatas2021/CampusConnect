import React from "react";
import { View, Text, StyleSheet, Linking, ImageBackground, Image, SafeAreaView, ScrollView, ToastAndroid, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton2";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";
import CopyButton from "@/components/svg/CopyButton2";
import Clipboard from "@react-native-clipboard/clipboard";

const handleEmailPress = () => {
    const email = "sae@documentodoestudante.com.br";
    const subject = "Isenção da Carteira de Estudante";
    const body = `Olá, tudo bem? Bom dia, boa tarde e/ou boa noite!\n\nSolicito a isenção da carteira estudantil.\n\nNúmero de Solicitação: (Inserir o número gerado na parte de pagamento.)\nNome: (Inserir o nome do estudante.)\n\nObservação: Preciso que a carteira seja homologada pelo Grande Recife.\n\nID Jovem anexado abaixo.`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto);
};

const handleCopy = () => {
    const texto = `Assunto: Isenção da Carteira de Estudante\n\n
    Corpo do E-mail: Olá, tudo bem? Bom dia, boa tarde e/ou boa noite! (Escolher conforme o horário da solicitação.)\n\n
    Solicito a isenção da carteira estudantil.\n\n
    Número de Solicitação: (Inserir o número gerado na parte de pagamento.)\n\n
    Nome: (Inserir o nome do estudante.)\n\n
    Observação: Preciso que a carteira seja homologada pelo Grande Recife.\n
    ID Jovem anexado abaixo.`;

    Clipboard.setString(texto);
    ToastAndroid.show("Fomato do e-mail copiado!", ToastAndroid.SHORT);
};

const Carteirafree = () => {
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
                        <Text style={styles.descricaotext}>Como tirar sua carteirinha de estudante de forma gratuita?</Text>
                    </ImageBackground>
                </View>

                {/* Imagem da Carteira */}
                <View style={styles.imagemview}>
                    <Image
                        source={require('./Carteira/Imagens/carteirafree.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.subtitleview}>
                    <Text style={styles.subtitletext}>
                        Itens necessários:
                    </Text>
                </View>

                {/* Descrição da Carteira */}
                <View style={styles.descricaocarteiraview}>
                    <Text style={styles.descricaocarteiratext}>
                        1. ID Jovem: Baixar o aplicativo e gerar o documento. A foto pode ser em qualquer formato, desde que o rosto esteja nítido.{"\n"}{"\n"}
                        2. Foto para a carteirinha DNE: Deve seguir regras específicas de enquadramento, disponíveis no site da DNE. Esta foto será adicionada após a confirmação da isenção.{"\n"}{"\n"}
                        3. Dados Pessoais.
                    </Text>
                </View>

                <View style={styles.subtitleview}>
                    <Text style={styles.subtitletext}>
                        Etapas para a solicitação:
                    </Text>
                </View>

                <View style={styles.descricaocarteiraview}>
                    <Text style={styles.descricaocarteiratext}>
                        1. Fazer o ID Jovem!{"\n"}
                        O ID Jovem comprovará sua isenção. Gere o documento através do aplicativo.
                    </Text>
                </View>

                {/* Botões */}
                <View style={styles.containerButton}>
                    <ImageBackground
                        source={require('./Carteira/Imagens/setasb.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.5}
                            onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.idjovem2")}
                        >
                            <Text style={styles.buttonText}>Baixar o ID Jovem</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                <View style={styles.descricaocarteiraview}>
                    <Text style={styles.descricaocarteiratext}>
                        2: Cadastro no site da DNE!{"\n"}
                        Acesse o site da DNE e faça o cadastro.{"\n"}
                        Na parte de pagamento, selecione a opção boleto.
                        Acima da carteirinha, haverá um campo com os detalhes da solicitação e o número da solicitação.
                    </Text>
                </View>

                <View style={styles.containerButtonb}>
                    <ImageBackground
                        source={require('./Carteira/Imagens/brilho.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.5}
                            onPress={() => Linking.openURL("https://www.documentodoestudante.com.br/")}
                        >
                            <Text style={styles.buttonText}>Acessar a DNE</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                <View style={styles.descricaocarteiraview}>
                    <Text style={styles.descricaocarteiratext}>
                        3: Envio do E-mail!{"\n"}
                        Enviar um e-mail  solicitando a isenção.
                    </Text>
                </View>

                <View style={styles.subtitleviewb}>
                    <ImageBackground
                        source={require('./Carteira/Imagens/brilho2.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                        <Text style={styles.subtitletextb}>
                            Utilize o seguinte modelo:
                        </Text>
                    </ImageBackground>
                </View>

                <View style={styles.descricaocarteiraviewv}>
                    <Text style={styles.descricaocarteiraemailtext}>
                        Assunto: Isenção da Carteira de Estudante{"\n"}{"\n"}
                        Corpo do E-mail: Olá, tudo bem? Bom dia, boa tarde e/ou boa noite! (Escolher conforme o horário da solicitação.){"\n"}{"\n"}
                        Solicito a isenção da carteira estudantil.{"\n"}{"\n"}
                        Número de Solicitação: (Inserir o número gerado na parte de pagamento.){"\n"}{"\n"}
                        Nome: (Inserir o nome do estudante.){"\n"}{"\n"}
                        Observação: Preciso que a carteira seja homologada pelo Grande Recife.{"\n"}
                        ID Jovem anexado abaixo.
                    </Text>
                    <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                        <CopyButton />
                    </TouchableOpacity>
                </View>


                <View style={styles.containerButton}>
                    <ImageBackground
                        source={require('./Carteira/Imagens/efeito.png')}
                        style={styles.imagens}
                        resizeMode="contain"
                    >
                        <TouchableOpacity
                            style={styles.button2}
                            activeOpacity={0.5}
                            onPress={handleEmailPress}
                        >
                            <Text style={styles.buttonText}>Acessar E-mail</Text>
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
        flex: 1, // Permite que o ImageBackground ocupe espaço dentro do container
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
        height: 100,
        alignSelf: 'center',
        alignItems: 'center',
    },
    subtitleview: {
        width: "60%",
        alignSelf: 'center',
        alignItems: 'center',
    },
    subtitleviewb: {
        width: "70%",
        alignSelf: 'center',
        alignItems: 'center',
    },
    subtitletextb: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#92C36B',
        width: '90%',
        borderRadius: 5,
        marginVertical: 20

    },
    subtitletext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#92C36B',
        width: '100%',
        borderRadius: 5,
        marginVertical: 20

    },
    descricaocarteiraview: {
        width: "85%",
        alignSelf: 'center',
        alignItems: 'center',
    },
    descricaocarteiratext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'left',
    },
    descricaocarteiraemailtext: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#000",
        textAlign: 'left',
    },
    descricaocarteiraviewv: {
        width: "85%",
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#7B9765',
        borderRadius: 10,
        padding: "8%",

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
        width: "100%",
        paddingVertical: "3%",
        paddingHorizontal: "6%",
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
        width: RFValue(130),
        textAlign: "center",
    },
    containerButton: {
        width: "70%",
        alignSelf: 'center',
        marginVertical: "6%"
    },
    containerButtonb: {
        width: "70%",
        height: RFValue(70),
        alignSelf: 'center',
        marginVertical: 20
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
        paddingHorizontal: "5%",
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
        marginTop: "4%",
        marginBottom: "14%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText2: {
        color: "#000",
        fontSize: RFValue(14),
        fontWeight: "bold",
    },
    copyButton: {
        position: "absolute",
        bottom: RFValue(-15),  // Define a margem inferior
        left: RFValue(100),   // Define a margem à direita
    },



});

export default Carteirafree;

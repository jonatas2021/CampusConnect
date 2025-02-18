import React, { useState } from "react";
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Animated
} from "react-native";
import { useRouter } from "expo-router";
import BackButton from "@/components/svg/BackButton";
import { RFValue } from "react-native-responsive-fontsize";

interface FeriadoProps {
    mes: string;
    dia: string;
    nome: string;
    tipo: string;
}

const CalendarScreen: React.FC = () => {
    const router = useRouter(); // CORRETO: useRouter() dentro do componente

    const backToIndex = () => {
        router.push("/screens");
    };

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [animatedHeight] = useState(new Animated.Value(80)); // Altura inicial maior

    const toggleDescription = (dia: string) => {
        if (selectedDay === dia) {
            // Ocultar descrição e voltar para a altura inicial
            Animated.timing(animatedHeight, {
                toValue: 80, // Volta para o tamanho original maior
                duration: 300,
                useNativeDriver: false,
            }).start(() => setSelectedDay(null));
        } else {
            setSelectedDay(dia);
            // Expande o retângulo
            Animated.timing(animatedHeight, {
                toValue: 150, // Expande para altura maior
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
    ];

    const feriados: FeriadoProps[] = [
        { dia: "01", nome: "Feriado nacional - Confraternização universal", tipo: "Feriados", mes: "Janeiro" },
        { dia: "02", nome: "Início do Recesso escolar", tipo: "Início/Fim do recesso", mes: "Janeiro" },
        { dia: "09", nome: "Fim do Recesso escolar", tipo: "Início/Fim do recesso", mes: "Janeiro" },
        { dia: "27 e 28", nome: "Resultado da validação de conhecimentos e experiências anteriores", tipo: "CRADT", mes: "Janeiro" },

        { dia: "03 a 04", nome: "Solicitação de reintegração curricular para o próximo semestre letivo (via formulário de requerimento)", tipo: "CRADT", mes: "Fevereiro" },
        { dia: "03 a 04", nome: "Solicitação de reopção de curso para o próximo semestre letivo (via formulário de requerimento)", tipo: "CRADT", mes: "Fevereiro" },
        { dia: "03 a 04", nome: "Solicitação de admissão por transferência entre Campi e de outros IF’s para o próximo semestre/ano letivo", tipo: "CRADT", mes: "Fevereiro" },
        { dia: "03 a 04", nome: "Solicitação de mudança de turno para o próximo semestre letivo (via formulário de requerimento)", tipo: "CRADT", mes: "Fevereiro" },

        { dia: "04 a 07", nome: "Resultado das solicitações de reintegração curricular e admissão por transferência entre Campi e de outros IF’s para o próximo semestre/ano letivo", tipo: "CRADT", mes: "Março" },
        { dia: "04 a 07", nome: "Resultado da solicitação de mudança de turno para 2025.1", tipo: "CRADT", mes: "Março" },
        { dia: "04 a 07", nome: "Resultado da solicitação de reopção de curso para o próximo semestre letivo", tipo: "CRADT", mes: "Março" },
        { dia: "04 a 07", nome: "Solicitação de reabertura de matrícula para 2025.1 para alunos com matrículas trancadas (via formulário de requerimento)", tipo: "CRADT", mes: "Março" },

        { dia: "10", nome: "Reunião dos Núcleos Docentes Estruturantes dos Cursos Superiores", tipo: "Aula normal", mes: "Março" },
        { dia: "12", nome: "Término da 2ª unidade letiva", tipo: "Início/Fim da unidade", mes: "Março" },
        { dia: "12 e 13", nome: "Demo Week", tipo: "Eventos", mes: "Março" },
        { dia: "17 e 18", nome: "Exames finais", tipo: "Aula normal", mes: "Março" },
        { dia: "19", nome: "Reunião de conselho de classe", tipo: "Reuniões", mes: "Março" },
        { dia: "20", nome: "Reunião de colegiado dos cursos superiores", tipo: "Reuniões", mes: "Março" },
        { dia: "21", nome: "Último dia para entrega do Relatório de Atividades Desenvolvidas", tipo: "Início/Fim do período", mes: "Março" },
        { dia: "21", nome: "Prazo final para envios/fechamento dos diários docentes", tipo: "CRADT", mes: "Março" },
        { dia: "21", nome: "Encerramento do semestre letivo 2024.2", tipo: "CRADT", mes: "Março" },
        { dia: "24", nome: "Início do Recesso acadêmico", tipo: "Início/Fim do recesso", mes: "Março" },

        { dia: "02", nome: "Fim do Recesso acadêmico", tipo: "Início/Fim do recesso", mes: "Abril" },
        { dia: "02", nome: "Resultado da solicitação de Reabertura de Matrícula", tipo: "CRADT", mes: "Abril" },
        { dia: "03 e 04", nome: "Encontro pedagógico 2025.1", tipo: "Aula normal", mes: "Abril" },
        { dia: "03 a 06", nome: "Matrícula Obrigatória para o próximo semestre/ano letivo", tipo: "CRADT", mes: "Abril" },
        { dia: "07", nome: "INÍCIO DO SEMESTRE LETIVO 2025.1", tipo: "Início/Fim do período", mes: "Abril" }

    ];

    const tiposDeFeriado = [
        { tipo: "Início/Fim do período", cor: "#92C36B" },
        { tipo: "Aula normal", cor: "#FFF" },
        { tipo: "Início/Fim da unidade", cor: "#57753D" },
        { tipo: "CRADT", cor: "#FFEF44" },
        { tipo: "Início/Fim do recesso", cor: "#E798C5" },
        { tipo: "Feriados", cor: "#E56B6B" },
        { tipo: "Eventos", cor: "#9463FF" },
        { tipo: "Reuniões", cor: "#EF7C52" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backArrowContainer}>
                <TouchableOpacity style={styles.backArrow} onPress={backToIndex}>
                    <BackButton width={25} height={25} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>C. Acadêmico 2024.2</Text>
            <View style={styles.separator} />
            <Text style={styles.lastUpdate}>Última atualização: 07/02/2025</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Meses e seus dias */}
                <View style={styles.mesesContainer}>
                    {meses.map((mes, index) => (
                        <View key={index} style={styles.mesContainer}>
                            {/* Nome do mês */}
                            <View style={styles.mesBox}>
                                <Text style={styles.mesText}>{mes}</Text>
                            </View>

                            {/* Dias do mês */}
                            <View style={styles.diasContainer}>
                                {feriados
                                    .filter((feriado) => feriado.mes === mes)
                                    .map((feriado, i) => {
                                        const isSelected = selectedDay === feriado.dia;
                                        return (
                                            <Animated.View
                                                key={i}
                                                style={[
                                                    styles.diaBox,
                                                    {
                                                        backgroundColor: tiposDeFeriado.find(t => t.tipo === feriado.tipo)?.cor,
                                                        height: isSelected ? animatedHeight : 80, // Altura inicial maior
                                                    }
                                                ]}
                                            >
                                                <TouchableOpacity
                                                    style={styles.touchable}
                                                    onPress={() => toggleDescription(feriado.dia)}
                                                >
                                                    <View style={styles.diaContent}>
                                                        <Text style={styles.diaText}>{feriado.dia}</Text>
                                                        <Text style={styles.diaTipoText}>{feriado.tipo}</Text>
                                                    </View>
                                                    {isSelected && (
                                                        <Text style={styles.descricaoText}>{feriado.nome}</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </Animated.View>
                                        );
                                    })}
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.tiposDeFeriadoContainer}>
                    {tiposDeFeriado.map((item, index) => (
                        <View key={index} style={styles.tipoFeriadoBox}>
                            <View style={[styles.tipoColorBox, { backgroundColor: item.cor }]} />
                            <Text style={styles.tipoText}>{item.tipo}</Text>
                        </View>
                    ))}
                </View>


            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: "4%",
        paddingTop: "6%",
    },
    backArrowContainer: {
        position: "absolute",
        top: "6%",
        left: "3%",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#DEFCC7",
    },
    backArrow: {
        zIndex: 2,
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
        width: "100%",
        height: 2,
        backgroundColor: "#000",
        marginBottom: 5,
    },
    lastUpdate: {
        fontSize: RFValue(12),
        color: "#888",
        textAlign: "right",
        marginBottom: 15,
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    mesesContainer: {
        flexDirection: "column",
    },
    mesContainer: {
        marginBottom: 2,
    },
    mesBox: {
        backgroundColor: "#1B5E20",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        width: '60%',
        alignSelf: 'flex-end',
        borderWidth: 1, // Adiciona borda
        borderColor: "#000", // Cor da borda
    },
    mesText: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
    },
    diasContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // Alinha os dias ao centro
    },

    diaBox: {
        borderRadius: 8,
        marginBottom: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1, // Adiciona borda
        borderColor: "#000", // Cor da borda
    },
    touchable: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    diaContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",  // Alinha à esquerda
        width: "100%", // Garantir que ocupe toda a largura disponível
        marginLeft: "10%"
    },
    diaText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "black",
        marginRight: 10,
        textAlign: 'left',  // Alinha o texto à esquerda
    },
    diaTipoText: {
        fontSize: 18,
        color: "black",
        textAlign: 'left',  // Alinha o texto à esquerda
    },
    descricaoText: {
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginTop: 10,
        fontWeight: "bold",
    },
    tiposDeFeriadoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start", // Alinha as colunas à esquerda
        marginTop: 30,
        paddingHorizontal: 15, // Aumenta o espaço entre as colunas
    },

    tipoFeriadoBox: {
        flexDirection: "row",
        alignItems: "center", // Alinha os itens na horizontal
        width: "25%", // Cada tipo ocupa 45% da largura, para que fiquem duas colunas
        marginBottom: 15,
        marginRight: "25%", // Aumenta o espaço entre as colunas
    },

    tipoColorBox: {
        width: 20,
        height: 20,
        marginRight: 10, // Espaço entre o quadrado de cor e o texto
        borderWidth: 1, // Adiciona borda
        borderColor: "#000", // Cor da borda
        borderRadius: 4, // Arredonda as bordas se desejar
    },

    tipoText: {
        fontSize: RFValue(10),
        color: "#000",
        textAlign: "left", // Alinha o texto à esquerda
    },

});


export default CalendarScreen;

import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView,TouchableOpacity } from "react-native";
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
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const feriados: FeriadoProps[] = [
        { dia: "01", nome: "Feriado nacional - Confraternização universal", tipo: "Feriados", mes: "Janeiro" },
        { dia: "02", nome: "Início do Recesso escolar", tipo: "Início/fim do período", mes: "Janeiro" },
        { dia: "09", nome: "Fim do Recesso escolar", tipo: "Início/fim do período", mes: "Janeiro" },
        { dia: "27", nome: "Resultado da validação de conhecimentos e experiências anteriores", tipo: "cradt", mes: "Janeiro" },
        { dia: "28", nome: "Resultado da validação de conhecimentos e experiências anteriores", tipo: "cradt", mes: "Janeiro" },
    ];

    const tiposDeFeriado = [
        { tipo: "Início/fim do período", cor: "#E798C5" }, // vermelho
        { tipo: "Aula normal", cor: "#FFF" }, // amarelo
        { tipo: "cradt", cor: "#FFEF44" }, // amarelo
        { tipo: "Feriados", cor: "#E56B6B" }, // verde        { tipo: "Início/fim do período", cor: "#E798C5" }, // vermelho
        { tipo: "Eventos", cor: "#9463FF" }, // amarelo
        { tipo: "Reuniões", cor: "#EF7C52" }, // verde
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backArrowContainer}>
        <TouchableOpacity style={styles.backArrow} onPress={backToIndex}>
          <BackButton width={25} height={25} />
        </TouchableOpacity>
      </View>
            <Text style={styles.title}>Email dos Docentes</Text>
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
                                    .filter((feriado) => feriado.mes === mes) // Filtra pelos feriados do mês
                                    .map((feriado, i) => (
                                        <View
                                            key={i}
                                            style={[styles.diaBox, { backgroundColor: tiposDeFeriado.find(t => t.tipo === feriado.tipo)?.cor }]} >
                                            <Text style={styles.diaText}>{feriado.dia}</Text>
                                            <Text style={styles.diaSemanaText}>Segunda-feira</Text>
                                            <Text style={styles.descricaoText}>{feriado.nome}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Legenda de Cores */}
                <View style={styles.legendaContainer}>
                    {tiposDeFeriado.map((item, index) => (
                        <View key={index} style={styles.legendaItem}>
                            <View style={[styles.legendaBox, { backgroundColor: item.cor }]} />
                            <Text style={styles.legendaText}>{item.tipo}</Text>
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
        paddingHorizontal: "4%", // Evita margens laterais excessivas
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
        backgroundColor: "#1B5E20", // Fundo verde para a caixa do mês
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        width: '60%', // Largura de 50%
        alignSelf: 'flex-end', // Alinha à direita
    },
    
    mesText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    diasContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // Alinha os dias ao centro
    },
    diaBox: {
        backgroundColor: "#92C36B", // Fundo dos dias
        borderRadius: 8,
        padding: 20,
        marginBottom: 10,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "flex-start",
        width: '100%',
        flexDirection: 'row', // Alinha os itens na horizontal
    },
    diaText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "black",
        marginRight: 5, // Adiciona um pequeno espaço entre o dia e o dia da semana
    },
    diaSemanaText: {
        fontSize: 18,
        color: "black",
    },
    descricaoText: {
        fontSize: 14,
        color: "black",
        textAlign: "center",
        flex: 1,
        marginTop: 'auto', // Isso vai empurrar o texto para o fundo
    },
    legendaContainer: {
        marginTop: 40,
    },
    legendaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    legendaBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 4,
    },
    legendaText: {
        fontSize: 16,
        color: "#333",
    },
});

export default CalendarScreen;
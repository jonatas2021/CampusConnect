import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Linking,
    ToastAndroid
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DiscipButton from "@/components/svg/DiscipButton";
import BaixarButton from "@/components/svg/BaixarButton";
import BackButton from "@/components/BackButton2";
import { RFValue } from "react-native-responsive-fontsize";
import semesters from "./tsi.json";

export default function SubjectsScreen() {
    const [expandedSemester, setExpandedSemester] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedSemester(expandedSemester === index ? null : index);
    };

    // Função para tratar o erro ao tentar abrir o link da ementa
    const handleDownload = (syllabusLink: string | null) => {
        if (!syllabusLink) {
            ToastAndroid.show("Ementa da disciplina não encontrada", ToastAndroid.SHORT); // Exibe a mensagem de erro
        } else {
            Linking.openURL(syllabusLink); // Abre o link se for válido
        }
    };    

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.titleContainer}>
            <Text style={styles.title}>Tecnologia em Sistemas para Internet</Text>
            </View>
            <View style={styles.separator} />
            <ScrollView>
                {semesters.map((sem, index) => {
                    const isExpanded = expandedSemester === index;

                    return (
                        <View key={index} style={styles.semesterCard}>
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={() => toggleExpand(index)}
                            >
                                <View style={styles.semesterInfo}>
                                    <DiscipButton style={styles.discipButton} />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.semesterText}>{sem.semester}</Text>
                                        <Text style={styles.subjectCountText}>
                                            {sem.subjects.length} disciplinas
                                        </Text>
                                    </View>
                                </View>
                                <Feather
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#fff"
                                />
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.subjectList}>
                                    {sem.subjects.map((subject, subIndex) => (
                                        <View key={subIndex} style={styles.subjectCard}>
                                            <Text style={styles.subjectTitle}>{subject.name}</Text>
                                            <View style={styles.subjectInfo}>
                                                <Text style={styles.subjectHours}>
                                                    Carga Horária: {subject.hours}
                                                </Text>
                                                <Text style={styles.subjectType}>{subject.type}</Text>
                                            </View>
                                            <Text style={styles.subjectReq}>
                                                Requisitos: {subject.requirements}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.downloadButton}
                                                onPress={() => handleDownload(subject.syllabusLink)} // Chama a função para tratar o link
                                            >
                                                <View style={styles.buttonContent}>
                                                    <Text style={styles.downloadText}>
                                                        Baixar ementa
                                                    </Text>
                                                    <BaixarButton style={styles.baixarButton} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8F5E9",
        paddingHorizontal: "4%",
        paddingTop: "6%",
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
        marginBottom: 20,
    },
    discipButton: {
        marginRight: 15,
    },
    baixarButton: {
        marginRight: 15,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center', // Alinha o texto e o ícone verticalmente
        justifyContent: 'center', // Centraliza o conteúdo dentro do botão
        width: '100%',
    },
    semesterCard: {
        marginBottom: 12,
        backgroundColor: "#2A5224",
        padding: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    semesterInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        marginLeft: 10,
    },
    semesterText: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
    },
    subjectCountText: {
        fontSize: RFValue(14),
        color: "#fff",
    },
    subjectList: {
        marginTop: 10,
    },
    subjectCard: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    subjectTitle: {
        fontSize: RFValue(18),
        fontWeight: "bold",
        color: "#333",
    },
    subjectInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    subjectHours: {
        fontSize: RFValue(14),
        color: "#555",
    },
    subjectType: {
        fontSize: RFValue(14),
        fontWeight: "bold",
        color: "#2A5224",
    },
    subjectReq: {
        fontSize: RFValue(12),
        color: "#777",
        marginTop: 4,
    },
    downloadButton: {
        marginTop: 8,
        backgroundColor: "#2A5224",
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: "center",
    },
    downloadText: {
        color: "#fff",
        fontSize: RFValue(14),
    },
    titleContainer: {
        width: "80%",
        alignSelf: "center"
    },
});

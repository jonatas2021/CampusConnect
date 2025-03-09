import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";



const Setores = () => {
    const navigation = useNavigation();
    const router = useRouter();


    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Setores</Text>
            <View style={styles.separator} />
            {/* Meia bola verde */}
            <View style={styles.halfCircle}>
                <Text style={styles.title2}>Selecione uma opção de setor:</Text>
            </View>

            {/* Botões */}
            <View style={styles.containerButton}>
            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Setores/Dapd")}>
                <Text style={styles.buttonText}>DAPD</Text>
                <Text style={styles.buttonText}>(Divisão de Apoio a Pessoa com Deficiência)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Setores/Depex")}>
                <Text style={styles.buttonText}>DEPEX</Text>
                <Text style={styles.buttonText}>(Divisão de Pesquisa e Extensão)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Setores/Den")}>
                <Text style={styles.buttonText}>DEN</Text>
                <Text style={styles.buttonText}>(Direção de Ensino)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Setores/Cradt")}>
                <Text style={styles.buttonText}>CRADT+</Text>
                <Text style={styles.buttonText}>(Coordenação de Registros Acadêmicos, Diplomação e Turnos)</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: "4%",
        paddingTop: "6%",
    },
    halfCircle: {
        top: 0,
        width: "50%",
        height: 100,
        backgroundColor: "#2A5224",
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: '10%'
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
    },
    title2: {
        fontSize: RFValue(16),
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff",
        textAlign: 'center',
    },
    button: {
        width: "100%",
        paddingVertical: "4%",
        height: RFValue(70),
        borderRadius: 5,
        marginVertical: "3%",
        borderWidth: 1,
        borderColor: "#000",
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#92C36B"
    },
    buttonText: {
        color: "#000",
        fontSize: RFValue(14),
        fontWeight: "bold",
        textAlign: 'center'
    },
    containerButton: {
        marginTop: "10%",
        width: "100%",
        justifyContent: 'center',
        alignSelf: 'center',

    }
});

export default Setores;

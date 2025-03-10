import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";



const Bolsas = () => {
    const navigation = useNavigation();
    const router = useRouter();


    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Bolsas e Estágio</Text>
            <View style={styles.separator} />
            {/* Meia bola verde */}
            <View style={styles.halfCircle}>
                <Text style={styles.title2}>Selecione uma opção:</Text>
            </View>

            {/* Botões */}
            <View style={styles.containerButton}>
            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Estagio")}>
                <Text style={styles.buttonText}>Estágio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Extensao")}>
                <Text style={styles.buttonText}>Extensão</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Manutencao")}>
                <Text style={styles.buttonText}>Manutenção Academica</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Monitoria")}>
                <Text style={styles.buttonText}>Monitoria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Pesquisa")}>
                <Text style={styles.buttonText}>Pesquisa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} 
              activeOpacity={0.5} // Reduz a opacidade ao pressionar
              onPress={() => router.push("/Screens/Bolsas/Tutoria")}>
                <Text style={styles.buttonText}>Tutoria</Text>
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
    },
    containerButton: {
        marginTop: "10%",
        width: "100%",
        justifyContent: 'center',
        alignSelf: 'center',

    }
});

export default Bolsas;

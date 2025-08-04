import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import BackButton from "@/components/BackButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

const UpdateScreen = () => {
    const [status, setStatus] = useState<'idle' | 'checking' | 'updated' | 'update-available'>('idle');
    const [currentVersion, setCurrentVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState('');

    const checkAppVersion = async () => {
        setStatus('checking');
        const version = DeviceInfo.getVersion();
        setCurrentVersion(version);

        // Aguarda 3 segundos antes de continuar
        await new Promise(resolve => setTimeout(resolve, 3000));


        try {
            const now = new Date();

            const db = getFirestore();
            const docRef = doc(db, 'app_version', 'current');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists) {
                const data = docSnap.data();
                const latest = data?.latest_version;
                const updateUrlu = data?.update_urlu;
                const notes = data?.notes;

                setLatestVersion(latest);

                if (latest && version !== latest) {
                    setStatus('update-available');

                    Alert.alert(
                        'Atualização disponível',
                        `Sua versão: ${version}\nVersão mais recente: ${latest}\n\nNotas:\n${notes}`,
                        [
                            {
                                text: 'Atualizar agora',
                                onPress: () => {
                                    if (updateUrlu) Linking.openURL(updateUrlu);
                                }
                            },
                            {
                                text: 'Atualizar depois',
                                style: 'cancel',
                            }
                        ]
                    );
                } else {
                    setStatus('updated');
                }
            } else {
                setStatus('idle');
                Alert.alert('Erro', 'Documento de versão não encontrado no servidor.');
            }
        } catch (error) {
            console.error('[Erro ao verificar versão]:', error);
            setStatus('idle');
            Alert.alert('Erro', 'Não foi possível verificar a versão do aplicativo.');
        }
    };

    const renderStatusImage = () => {
        switch (status) {
            case 'checking':
                return <Image source={require('../../assets/images/Loading.gif')} style={styles.gif} />;
            case 'updated':
                return <Image source={require('../../assets/images/UpdateOk.gif')} style={styles.gif} />;
            case 'update-available':
                return <Image source={require('../../assets/images/UpdateDis.gif')} style={styles.gif} />;
            default:
                return <Image source={require('../../assets/images/Check.gif')} style={styles.gif} />;
        }
    };

    const renderStatusText = () => {
        switch (status) {
            case 'checking':
                return 'Verificando atualizações...';
            case 'updated':
                return `Aplicativo atualizado, versão atual: ${currentVersion}`;
            case 'update-available':
                return `Nova versão disponível: ${latestVersion}`;
            default:
                return 'Clique no botão abaixo para verificar se há uma nova versão disponivel.';
        }
    };

    return (
        <View style={styles.container}>
            {/* Topo */}
            <BackButton />
            <View style={styles.topSection}>
                <Text style={styles.title}>Atualização do App</Text>
                <View style={styles.separator} />
            </View>

            {/* Conteúdo central */}
            <View style={styles.middleSection}>
                {renderStatusImage()}
                <Text style={styles.text}>{renderStatusText()}</Text>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={checkAppVersion}
                    disabled={status === 'checking'}
                >
                    <Text style={styles.buttonText}>Verificar atualização</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

export default UpdateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
        paddingHorizontal: "4%",
        width: "100%",
        height: 2,
        backgroundColor: "#000",
    },
    text: {
        color: "#000",
        fontSize: RFValue(14),
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: 'center'
    },
    button: {
        width: "100%",
        paddingVertical: "4%",
        paddingHorizontal: "20%",
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
    gif: {
        width: '80%',
        height: '40%',
        resizeMode: 'contain'
    },

    topSection: {
        alignItems: 'center',
    },

    middleSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        marginBottom: '40%'
    },

});

import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';
import BackButton from "@/components/BackButton2";
const PalestraIcon = require('../../assets/images/DemoW/Palestra.png');
const ProjetoIcon = require('../../assets/images/DemoW/Projetos.png');
const JogoIcon = require('../../assets/images/DemoW/Jogos.png');
const BackgroundImage = require('../../assets/images/DemoW/Background.png');
const HeaderImage = require('../../assets/images/DemoW/Header.png');

const getIcon = (categoria: string) => {
    switch (categoria) {
        case 'Palestra':
            return PalestraIcon;
        case 'Projeto':
            return ProjetoIcon;
        case 'Jogo':
            return JogoIcon;
        default:
            return require('../../assets/images/DemoW/Jogos.png');
    }
};

type Evento = {
    id: string;
    categoria: 'Palestra' | 'Projeto' | 'Jogo';
    data: string; // formato ISO: "2025-07-24"
    hora: string; // formato: "HH:MM - HH:MM"
    titulo: string;
    ministrante: string;
    local: string;
};

const eventos: Evento[] = [
    {
        id: '1',
        categoria: 'Palestra',
        data: '2025-07-24',
        hora: '09:00 - 09:45',
        titulo: 'Abertura Oficial',
        ministrante: 'Prof. João Silva',
        local: 'Auditório Central',
    },
    {
        id: '2',
        categoria: 'Projeto',
        data: '2025-07-25',
        hora: '10:00 - 11:00',
        titulo: 'Apresentação de App',
        ministrante: 'Equipe TSI',
        local: 'Sala 204',
    },
    {
        id: '3',
        categoria: 'Jogo',
        data: '2025-07-26',
        hora: '14:00 - 15:00',
        titulo: 'Torneio de Xadrez',
        ministrante: 'Clube de Jogos',
        local: 'Pátio Interno',
    },
        {
        id: '4',
        categoria: 'Palestra',
        data: '2025-07-24',
        hora: '09:00 - 09:45',
        titulo: 'Abertura Oficial',
        ministrante: 'Prof. João Silva',
        local: 'Auditório Central',
    },    {
        id: '5',
        categoria: 'Palestra',
        data: '2025-07-24',
        hora: '09:00 - 09:45',
        titulo: 'Abertura Oficial',
        ministrante: 'Prof. João Silva',
        local: 'Auditório Central',
    },    {
        id: '6',
        categoria: 'Palestra',
        data: '2025-07-24',
        hora: '09:00 - 09:45',
        titulo: 'Abertura Oficial',
        ministrante: 'Prof. João Silva',
        local: 'Auditório Central',
    },
];

function getStatus(data: string, hora: string): 'em andamento' | 'encerrado' | 'ainda vai acontecer' {
    const [inicioStr, fimStr] = hora.split(' - ');
    const [hInicio, mInicio] = inicioStr.split(':').map(Number);
    const [hFim, mFim] = fimStr.split(':').map(Number);

    const agora = new Date();

    const inicioEvento = new Date(data);
    inicioEvento.setHours(hInicio, mInicio, 0, 0);

    const fimEvento = new Date(data);
    fimEvento.setHours(hFim, mFim, 0, 0);

    if (agora >= inicioEvento && agora <= fimEvento) return 'em andamento';
    if (agora < inicioEvento) return 'ainda vai acontecer';
    return 'encerrado';
}

const DemoWeekScreen = () => {
    const renderEvento = ({ item }: { item: Evento }) => {
        const status = getStatus(item.data, item.hora);

        return (
            <View style={styles.card}>
                <Text
                    style={[
                        styles.tag,
                        status === 'em andamento'
                            ? styles.andamento
                            : status === 'encerrado'
                                ? styles.encerrado
                                : styles.aguardando,
                    ]}
                >
                    {status.toUpperCase()}
                </Text>
                <Text style={styles.data}>{formatarData(item.data)}</Text>
                <Text style={styles.hora}>{item.hora}</Text>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <View style={styles.detailRow}>
                    <Image source={require('../../assets/images/DemoW/Palestra.png')} style={styles.icon2} />
                    <Text style={styles.detailText}>{item.ministrante}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Image source={require('../../assets/images/DemoW/Local.png')} style={styles.icon2} />
                    <Text style={styles.detailText}>{item.local}</Text>
                </View>

            </View>
        );
    };

    const categorias: Evento['categoria'][] = ['Palestra', 'Projeto', 'Jogo'];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackButton />
            <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
                <ScrollView>
                    {/* Cabeçalho */}
                    <View style={styles.headerContainer}>
                        <Image source={HeaderImage} style={styles.headerImage} />
                    </View>

                    {/* Categorias e listas */}
                    {categorias.map((categoria) => (
                        <View key={categoria}>
                            <View style={styles.sectionHeader}>
                                <Image source={getIcon(categoria)} style={styles.icon} />
                                <Text style={styles.header}>{categoria}s</Text>
                            </View>
                            <FlatList
                                data={eventos.filter((e) => e.categoria === categoria)}
                                keyExtractor={(item) => item.id}
                                renderItem={renderEvento}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.listContainer}
                            />
                        </View>
                    ))}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>

    );
};

function formatarData(data: string): string {
    const opcoes: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

export default DemoWeekScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
        color: '#fff'
    },
    listContainer: {
        paddingBottom: 10,
        paddingLeft: 5,
    },
    card: {
        backgroundColor: '#2B2B2B',
        borderRadius: 12,
        padding: 15,
        marginRight: 12,
        width: 230,
        elevation: 2,
    },
    tag: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
        color: '#fff',
    },
    andamento: {
        backgroundColor: '#2A2B73',
    },
    encerrado: {
        backgroundColor: '#A92935',
    },
    aguardando: {
        backgroundColor: '#A27900',
    },
    data: {
        fontSize: 13,
        color: '#fff',
        marginBottom: 4,
    },
    hora: {
        fontSize: 14,
        marginBottom: 5,
        color: '#fff',
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#fff',

    },
    ministrante: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 4,
    },
    local: {
        fontSize: 13,
        color: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingLeft: 5,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 8,
        resizeMode: 'contain',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    headerContainer: {
        alignItems: 'center',
    },

    headerImage: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
    detailRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
icon2: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
  marginRight: 6,
},
detailText: {
  fontSize: 14,
  color: '#fff',
},


});

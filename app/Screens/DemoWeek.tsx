import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native';
import { getFirestore, collection, query, onSnapshot } from '@react-native-firebase/firestore';
import BackButton from "@/components/BackButton2";
import { RFValue } from 'react-native-responsive-fontsize';

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
    dia: string; // formato ISO: "2025-07-24"
    hora_inicio: string; // formato: "HH:MM"
    hora_fim: string;    // formato: "HH:MM"
    titulo: string;
    ministrante: string;
    local: string;
};

function getStatus(data: string, hora_inicio?: string, hora_fim?: string): 'em andamento' | 'encerrado' | 'ainda vai acontecer' {
    if (!hora_inicio || !hora_fim) return 'ainda vai acontecer';

    const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
    const [hFim, mFim] = hora_fim.split(':').map(Number);

    const agora = new Date();

    const [ano, mes, dia] = data.split('-').map(Number);
    const inicioEvento = new Date(ano, mes - 1, dia, hInicio, mInicio);
    const fimEvento = new Date(ano, mes - 1, dia, hFim, mFim);


    if (agora >= inicioEvento && agora <= fimEvento) return 'em andamento';
    if (agora < inicioEvento) return 'ainda vai acontecer';
    return 'encerrado';
}

const getEventoFocoIndex = (eventos: Evento[]) => {
    const agora = new Date();

    // Primeiro tenta achar o evento "em andamento"
    const emAndamentoIndex = eventos.findIndex(evento => {
        const inicio = new Date(`${evento.dia}T${evento.hora_inicio}:00`);
        const fim = new Date(`${evento.dia}T${evento.hora_fim}:00`);
        return agora >= inicio && agora <= fim;
    });

    if (emAndamentoIndex !== -1) {
        return emAndamentoIndex;
    }

    // Se nenhum em andamento, acha o próximo que ainda vai acontecer
    const proximos = eventos.filter(evento => {
        const inicio = new Date(`${evento.dia}T${evento.hora_inicio}:00`);
        return inicio > agora;
    });

    if (proximos.length === 0) {
        // Se não tem evento futuro, foca no último evento
        return eventos.length - 1;
    }

    // Pega o índice do próximo evento no array original
    const proxEvento = proximos[0];
    return eventos.findIndex(evento => evento.id === proxEvento.id);
};

const CARD_WIDTH = 230;  // largura do card do evento
const CARD_MARGIN_RIGHT = 12; // marginRight do estilo

const DemoWeekScreen = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const db = getFirestore();
    const flatListRefs = useRef<{ [key: string]: any }>({}); // refs para cada FlatList por categoria

    useEffect(() => {
        const q = query(collection(db, 'demoweek'));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const dados: Evento[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Evento, 'id'>),
                }));

                const agora = new Date();

                const encerrados = dados.filter((evento) => {
                    const fimEvento = new Date(`${evento.dia}T${evento.hora_fim}:00`);
                    return fimEvento < agora;
                });

                const futuros = dados.filter((evento) => {
                    const fimEvento = new Date(`${evento.dia}T${evento.hora_fim}:00`);
                    return fimEvento >= agora;
                });

                encerrados.sort((a, b) => {
                    const dtA = new Date(`${a.dia}T${a.hora_fim}:00`);
                    const dtB = new Date(`${b.dia}T${b.hora_fim}:00`);
                    return dtA.getTime() - dtB.getTime();
                });

                futuros.sort((a, b) => {
                    const dtA = new Date(`${a.dia}T${a.hora_inicio}:00`);
                    const dtB = new Date(`${b.dia}T${b.hora_inicio}:00`);
                    return dtA.getTime() - dtB.getTime();
                });

                const ordenados = [...encerrados, ...futuros];

                setEventos(ordenados);
            },
            (error) => {
                console.error('Erro no onSnapshot:', error);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Após atualizar eventos, rola para o índice de foco de cada categoria
        ['Palestra', 'Projeto', 'Jogo'].forEach((categoria) => {
            const eventosPorCategoria = eventos.filter((e) => e.categoria === categoria);
            const initialIndex = getEventoFocoIndex(eventosPorCategoria);
            if (initialIndex >= 0 && flatListRefs.current[categoria]) {
                flatListRefs.current[categoria].scrollToIndex({ index: initialIndex, animated: true });
            }
        });
    }, [eventos]);

    const renderEvento = ({ item }: { item: Evento }) => {
        const status = getStatus(item.dia, item.hora_inicio, item.hora_fim);

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
                <Text style={styles.data}>{formatarData(item.dia)}</Text>
                <Text style={styles.hora}>{`${item.hora_inicio} - ${item.hora_fim}`}</Text>
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
                    <View style={styles.headerContainer}>
                        <Image source={HeaderImage} style={styles.headerImage} />
                    </View>

                    {categorias.map((categoria) => {
                        const eventosPorCategoria = eventos.filter((e) => e.categoria === categoria);

                        return (
                            <View key={categoria}>
                                <View style={styles.sectionHeader}>
                                    <Image source={getIcon(categoria)} style={styles.icon} />
                                    <Text style={styles.header}>{categoria}s</Text>
                                </View>
                                <FlatList
                                    ref={(ref) => (flatListRefs.current[categoria] = ref)}
                                    data={eventosPorCategoria}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderEvento}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.listContainer}
                                    getItemLayout={(data, index) => ({
                                        length: CARD_WIDTH + CARD_MARGIN_RIGHT,
                                        offset: (CARD_WIDTH + CARD_MARGIN_RIGHT) * index,
                                        index,
                                    })}
                                />
                            </View>
                        );
                    })}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

function formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-').map(Number);
    const dataLocal = new Date(ano, mes - 1, dia); // Mês começa do 0

    const opcoes: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    return dataLocal.toLocaleDateString('pt-BR', opcoes);
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    headerContainer: {
        alignItems: 'center',
    },
    headerImage: {
        height: RFValue(200),
        resizeMode: 'contain',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(10),
        paddingLeft: "2%",
    },
    icon: {
        width: RFValue(28),
        height: RFValue(28),
        marginRight: "2%",
        resizeMode: 'contain',
    },
    listContainer: {
        paddingBottom: RFValue(10),
        paddingLeft: RFValue(10),
    },
    card: {
        backgroundColor: '#2B2B2B',
        borderRadius: "5%",
        padding: RFValue(14),
        marginRight: RFValue(10),
        width: RFValue(180),
        elevation: 2,
    },
    tag: {
        fontSize: RFValue(10),
        fontWeight: 'bold',
        padding: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: RFValue(6),
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
        fontSize: RFValue(12),
        color: '#fff',
        marginBottom: RFValue(4),
    },
    hora: {
        fontSize: RFValue(12),
        color: '#fff',
        marginBottom: RFValue(4),
    },
    titulo: {
        fontSize: RFValue(12),
        fontWeight: 'bold',
        marginBottom: RFValue(4),
        color: '#fff',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: RFValue(4),
    },
    icon2: {
        width: RFValue(16),
        height: RFValue(16),
        resizeMode: 'contain',
        marginRight: RFValue(4),
    },
    detailText: {
        fontSize: RFValue(12),
        color: '#fff',
    },
    header: {
        fontSize: RFValue(16),
        fontWeight: 'bold',
        paddingLeft: RFValue(4),
        color: '#fff',
    },
});

export default DemoWeekScreen;

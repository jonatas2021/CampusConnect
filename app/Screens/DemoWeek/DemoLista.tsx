import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Modal, TextInput, Button, Alert, Pressable, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@react-native-firebase/firestore';
import { RFValue } from 'react-native-responsive-fontsize';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

type Evento = {
  id: string;
  titulo: string;
  ministrante: string;
  local: string;
  dia: string;
  hora_inicio: string;
  hora_fim: string;
  categoria: 'Palestra' | 'Projeto' | 'Jogo';
};

const DemoWeekEventos = () => {
  const db = getFirestore();
  const [Palestra, setPalestras] = useState<Evento[]>([]);
  const [Projeto, setProjetos] = useState<Evento[]>([]);
  const [Jogo, setJogos] = useState<Evento[]>([]);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);

  // Estados para edição
  const [titulo, setTitulo] = useState('');
  const [ministrante, setMinistrante] = useState('');
  const [local, setLocal] = useState('');
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [categoria, setCategoria] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);
  const [showHoraFimPicker, setShowHoraFimPicker] = useState(false);

  const onChangeData = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 10); // yyyy-mm-dd
      setDia(iso);
    }
  };

  const onChangeHoraInicio = (_: any, selectedTime?: Date) => {
    setShowHoraInicioPicker(false);
    if (selectedTime) {
      const timeStr = selectedTime.toTimeString().slice(0, 5); // HH:mm
      setHoraInicio(timeStr);
    }
  };

  const onChangeHoraFim = (_: any, selectedTime?: Date) => {
    setShowHoraFimPicker(false);
    if (selectedTime) {
      const timeStr = selectedTime.toTimeString().slice(0, 5);
      setHoraFim(timeStr);
    }
  };


  const carregarEventos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'demoweek'));
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Evento[];

      // ✅ Ordenar por data + hora em ordem decrescente (mais recente primeiro)
      const ordenados = todos.sort((a, b) => {
        const dataA = new Date(`${a.dia}T${a.hora_inicio}`);
        const dataB = new Date(`${b.dia}T${b.hora_fim}`);
        return dataB.getTime() - dataA.getTime();
      });

      // ✅ Separar por categoria
      setPalestras(ordenados.filter(e => e.categoria === 'Palestra'));
      setProjetos(ordenados.filter(e => e.categoria === 'Projeto'));
      setJogos(ordenados.filter(e => e.categoria === 'Jogo'));
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };


  useEffect(() => {
    carregarEventos();
  }, []);

  // Abrir modal para editar
  const abrirModal = (evento: Evento) => {
    setEventoSelecionado(evento);
    setTitulo(evento.titulo);
    setMinistrante(evento.ministrante);
    setLocal(evento.local);
    setCategoria(evento.categoria);
    setDia(evento.dia);
    setHoraInicio(evento.hora_inicio);
    setHoraFim(evento.hora_fim);
    setModalVisible(true);
  };

  // Salvar edição no Firestore
  const salvarEdicao = async () => {
    if (!eventoSelecionado) return;

    try {
      const docRef = doc(db, 'demoweek', eventoSelecionado.id);
      await updateDoc(docRef, {
        titulo,
        ministrante,
        local,
        categoria,
        dia,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
      });
      setModalVisible(false);
      carregarEventos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
      console.error(error);
    }
  };

  // Excluir evento
  const excluirEvento = async () => {
    if (!eventoSelecionado) return;

    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o evento "${eventoSelecionado.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'demoweek', eventoSelecionado.id);
              await deleteDoc(docRef);
              setModalVisible(false);
              carregarEventos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o evento');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Evento }) => (
    <TouchableOpacity onPress={() => abrirModal(item)}>
      <View style={styles.eventItem}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text>👤 {item.ministrante}</Text>
        <Text>📍 {item.local}</Text>
        <Text>📍 {item.categoria}</Text>
        <Text>🕒 {item.dia} | {item.hora_inicio} - {item.hora_fim}</Text>
      </View>
    </TouchableOpacity>
  );

  const dadosPorCategoria = [
    { titulo: "📢 Palestras", data: Palestra },
    { titulo: "📂 Projetos", data: Projeto },
    { titulo: "🎮 Jogos", data: Jogo },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title2}>Gerenciar Notificações</Text>
      <View style={styles.separator} />

      <FlatList
        data={dadosPorCategoria}
        keyExtractor={(item) => item.titulo}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>{item.titulo}</Text>
            {item.data.length > 0 ? (
              <FlatList
                data={item.data}
                keyExtractor={(evento) => evento.id}
                renderItem={renderItem}
                scrollEnabled={false} // desabilita scroll interno
              />
            ) : (
              <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
            )}
          </View>
        )}
        ListFooterComponent={
          <Pressable
            style={styles.buttonuser}
            onPress={() => router.push('/Screens/DemoWeek/DemoWeekManager')}
          >
            <Text style={styles.buttonText}>Criar Evento</Text>
          </Pressable>
        }
      />

      {/* Modal permanece igual */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Evento</Text>

          {/* Inputs */}
          <Text>Título</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

          <Text>Ministrante</Text>
          <TextInput style={styles.input} value={ministrante} onChangeText={setMinistrante} />

          <Text>Local</Text>
          <TextInput style={styles.input} value={local} onChangeText={setLocal} />

          <Text>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              <Picker.Item label="Palestra" value="Palestra" />
              <Picker.Item label="Projeto" value="Projeto" />
              <Picker.Item label="Jogo" value="Jogo" />
            </Picker>
          </View>


          <Text>Dia</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{dia || 'Selecionar data'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dia ? new Date(dia) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeData}
            />
          )}

          <Text>Hora Início</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowHoraInicioPicker(true)}>
            <Text>{horaInicio || 'Selecionar hora de início'}</Text>
          </TouchableOpacity>
          {showHoraInicioPicker && (
            <DateTimePicker
              value={horaInicio ? new Date(`${dia}T${horaInicio}`) : new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeHoraInicio}
            />
          )}

          <Text>Hora Fim</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowHoraFimPicker(true)}>
            <Text>{horaFim || 'Selecionar hora de fim'}</Text>
          </TouchableOpacity>
          {showHoraFimPicker && (
            <DateTimePicker
              value={horaFim ? new Date(`${dia}T${horaFim}`) : new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeHoraFim}
            />
          )}

          <View style={styles.buttonRow}>
            <Button title="Salvar" onPress={salvarEdicao} />
            <Button title="Excluir" color="red" onPress={excluirEvento} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

};

export default DemoWeekEventos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingTop: '6%',
    backgroundColor: '#fff'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  eventItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  },
  title2: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
    marginTop: '10%',
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 12
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buttonuser: {
    backgroundColor: '#2A2B73',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    // Ajuste a altura para alinhar com os inputs
    height: 40,
    justifyContent: 'center',
  },

});

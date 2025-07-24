import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, addDoc, getDocs } from '@react-native-firebase/firestore';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from '@/components/BackButton';

const DemoWeekManager = () => {
  const [titulo, setTitulo] = useState('');
  const [ministrante, setMinistrante] = useState('');
  const [local, setLocal] = useState('');
  const [categoria, setCategoria] = useState('Palestra'); // padrão inicial

  // Estados para data e hora agora como objetos Date
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [horaInicio, setHoraInicio] = useState(new Date());
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);

  const [horaFim, setHoraFim] = useState(new Date());
  const [showHoraFimPicker, setShowHoraFimPicker] = useState(false);

  const [eventos, setEventos] = useState<any[]>([]);

  const db = getFirestore();

  const salvarEvento = async () => {
    if (!titulo || !ministrante || !local) return;

    // Formatar data e horas para string no formato desejado
    const diaStr = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const horaInicioStr = horaInicio.toTimeString().slice(0, 5);
    const horaFimStr = horaFim.toTimeString().slice(0, 5);


    await addDoc(collection(db, 'demoweek'), {
      titulo,
      ministrante,
      local,
      categoria,
      dia: diaStr,
      hora_inicio: horaInicioStr,
      hora_fim: horaFimStr,
    });

    setTitulo('');
    setMinistrante('');
    setLocal('');
    setCategoria('Palestra');
    setData(new Date());
    setHoraInicio(new Date());
    setHoraFim(new Date());

    buscarEventos();
  };

  const buscarEventos = async () => {
    const querySnapshot = await getDocs(collection(db, 'demoweek'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEventos(data);
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  // Handlers para mostrar DatePicker e TimePicker
  const onChangeData = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setData(selectedDate);
  };

  const onChangeHoraInicio = (event: any, selectedDate?: Date) => {
    setShowHoraInicioPicker(Platform.OS === 'ios');
    if (selectedDate) setHoraInicio(selectedDate);
  };

  const onChangeHoraFim = (event: any, selectedDate?: Date) => {
    setShowHoraFimPicker(Platform.OS === 'ios');
    if (selectedDate) setHoraFim(selectedDate);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Criar Evento</Text>
      <View style={styles.separator} />
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Ministrante" value={ministrante} onChangeText={setMinistrante} />
      <TextInput style={styles.input} placeholder="Local" value={local} onChangeText={setLocal} />

      <Text style={styles.label}>Categoria</Text>
                <View style={styles.pickerContainer}>
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
      >
        <Picker.Item label="Palestras" value="Palestra" />
        <Picker.Item label="Projetos" value="Projeto" />
        <Picker.Item label="Jogos" value="Jogo" />
      </Picker>
      </View>

      <Text style={styles.label}>Data do Evento</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{data.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeData}
        />
      )}

      <Text style={styles.label}>Hora Início</Text>
      <TouchableOpacity onPress={() => setShowHoraInicioPicker(true)} style={styles.input}>
        <Text>{horaInicio.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showHoraInicioPicker && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeHoraInicio}
        />
      )}

      <Text style={styles.label}>Hora Fim</Text>
      <TouchableOpacity onPress={() => setShowHoraFimPicker(true)} style={styles.input}>
        <Text>{horaFim.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showHoraFimPicker && (
        <DateTimePicker
          value={horaFim}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeHoraFim}
        />
      )}

      <Button title="Salvar Evento" onPress={salvarEvento} />

      <FlatList
        data={eventos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item.categoria.toUpperCase()}: {item.titulo}</Text>
            <Text>{item.hora_inicio} - {item.hora_fim} | {item.dia}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default DemoWeekManager;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
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
    marginBottom: '6%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  eventItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  eventText: {
    fontWeight: '600',
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

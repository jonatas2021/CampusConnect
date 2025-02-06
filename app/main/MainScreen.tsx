import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
const params = useLocalSearchParams();
const name = params.name ? String(params.name) : "Usuário"; 
console.log("Nome recebido na Home:", name);
  const menuItems = [
    {
      id: 1,
      label: 'Calendário Acadêmico',
      icon: 'calendar-month' as const,
      onPress: () => console.log('Academic Calendar'),
    },
    {
      id: 2,
      label: 'Bolsas e Estágios',
      icon: 'briefcase-account' as const,
      onPress: () => console.log('Scholarships'),
    },
    {
      id: 3,
      label: 'Cursos',
      icon: 'notebook-edit' as const,
      onPress: () => console.log('Courses'),
    },
    {
      id: 4,
      label: 'Contatos',
      icon: 'email' as const,
      onPress: () => console.log('Contacts'),
    },
    {
      id: 5,
      label: 'Horários do Ônibus',
      icon: 'clock' as const,
      onPress: () => console.log('Bus Schedule'),
    },
    {
      id: 6,
      label: 'Núcleos de Apoio',
      icon: 'account-group' as const,
      onPress: () => console.log('Support Centers'),
    },
    {
      id: 7,
      label: 'Acesso ao QAcadêmico',
      icon: 'web' as const,
      onPress: () => console.log('QAcadêmico Access'),
    },
    {
      id: 8,
      label: 'Formulários',
      icon: 'file-document-edit' as const,
      onPress: () => console.log('Forms'),
    },
    {
      id: 9,
      label: 'Setores',
      icon: 'office-building' as const,
      onPress: () => console.log('Departments'),
    },
    {
      id: 10,
      label: 'Grupos do WhatsApp',
      icon: 'whatsapp' as const,
      onPress: () => console.log('WhatsApp Groups'),
    },
    {
      id: 11,
      label: 'Apoio Psicológico',
      icon: 'head-heart' as const,
      onPress: () => console.log('Psychological Support'),
    },
    {
      id: 12,
      label: 'Suporte',
      icon: 'help-circle' as const,
      onPress: () => console.log('Support'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Bom dia, {name}!</Text>
      
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <Pressable style={styles.menuButton} onPress={item.onPress}>
            <MaterialCommunityIcons name={item.icon} size={66} color="white" />
            <Text style={styles.buttonText}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 16,
    paddingTop: 62,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 16,
    color: '#000',
  },
  gridContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  menuButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#35672D',
    margin: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

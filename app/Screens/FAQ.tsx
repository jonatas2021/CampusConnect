import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function FAQScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 1,
      question: 'Como faço para obter uma bolsa?',
      answer: 'Open the Tradebase app to get started and follow the steps. Tradebase doesn\'t charge a fee to create or maintain your Tradebase account.',
      expanded: false
    },
    {
      id: 2,
      question: 'O que fazemos em dias intensos de chuvas?',
      answer: 'Em casos de chuvas intensas, a instituição avalia as condições de segurança e pode suspender as aulas. Fique atento às comunicações oficiais via e-mail e canais da instituição.',
      expanded: false
    },
    {
      id: 3,
      question: 'Como faço para justificar as faltas?',
      answer: 'Para justificar faltas, você deve apresentar documentação comprobatória (como atestados médicos) à Coordenação do seu curso dentro de 3 dias úteis após o retorno às atividades.',
      expanded: false
    },
    {
      id: 4,
      question: 'Como faço para obter meu diploma?',
      answer: 'Para solicitar seu diploma, você deve ter integralizado todas as disciplinas e requisitos do curso. Após isso, abra um requerimento junto à Coordenação de Registro Acadêmico.',
      expanded: false
    }
  ]);

  const toggleExpand = (id: number) => {
    setFaqItems(faqItems.map(item => 
      item.id === id ? {...item, expanded: !item.expanded} : item
    ));
  };

  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <BackButton onPress={() => router.back()} />
        </View>
        <Text style={styles.headerTitle}>Suporte</Text>
      </View>
      
      <View style={styles.divider} />
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Como podemos ajudá-lo?</Text>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#2A5224" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Faça sua busca"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqTitle}>Perguntas Frequentes</Text>
            <TouchableOpacity style={{backgroundColor: '#e8f5e9'}}>
              <Text style={styles.viewAllText}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          
          {filteredFAQs.map(item => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion} 
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <MaterialIcons 
                  name={item.expanded ? "remove" : "add"} 
                  size={24} 
                  color="#35672D" 
                />
              </TouchableOpacity>
              
              {item.expanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.supportButton}
        onPress={() => router.push('/Screens/Support/ChatScreen')}
      >
        <View style={styles.supportButtonContent}>
          <MaterialIcons name="headset" size={24} color="#e8f5e9" style={styles.supportIcon} />
          <Text style={styles.supportButtonText}>Falar com suporte</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B3939',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#224805',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEFCC7',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
    color: '#2A5224',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  faqSection: {
    marginTop: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3939',
  },
  viewAllText: {
    fontSize: 14,
    color: '#224805',
    fontWeight: '500',
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A5224',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingVertical: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B3939',
    flex: 1,
  },
  faqAnswer: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  answerText: {
    fontSize: 14,
    color: '#3B3939',
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: '#35672D',
    paddingVertical: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportIcon: {
    marginRight: 10,
  },
  supportButtonText: {
    color: '#e8f5e9',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

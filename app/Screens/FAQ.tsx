import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Linking,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';
import { RFValue } from "react-native-responsive-fontsize";

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
      answer: 'Na tela de Bolsas e Estágio você pode verificar os editais dos programas de bolsas disponíveis e assim acompanhar os prazos, caso ocorra alguma dúvida você pode entrar em contato com o setor responsável clicando em setores.',
      expanded: false
    },
    {
      id: 2,
      question: 'O que fazemos em dias intensos de chuvas?',
      answer: 'Em casos de chuvas intensas, a instituição avalia as condições de segurança e pode suspender as aulas. Fique atento às comunicações oficiais via e-mail e canais da instituição. Em caso de dúvidas entre em contato com a CRADT.',
      expanded: false
    },
    {
      id: 3,
      question: 'Como faço para justificar as faltas?',
      answer: 'Para justificar faltas, você deve preencher um formulário, e enviar via requerimento para a CRADT solicitando a justificativa das faltas.',
      expanded: false
    },
    {
      id: 4,
      question: 'Como faço para obter meu certificado ou diploma?',
      answer: 'Para solicitar seu diploma, você deve preencher um formulário, e enviar via requerimento para a CRADT solicitando o seu certificado ou diploma.',
      expanded: false
    },
    {
      id: 5,
      question: 'Como faço para trancar a matrícula?',
      answer: 'Para trancar a matrícula, você deve preencher um formulário, e enviar via requerimento para a CRADT solicitando o trancamento da matrícula, dentro do prazo estabelecido no calendário acadêmico.',
      expanded: false
    },
    {
      id: 6,
      question: 'Posso trocar de turma?',
      answer: 'Sim, é possível solicitar a troca de turma junto à Coordenação, desde que haja vaga disponível e a solicitação esteja dentro do prazo.',
      expanded: false
    },
    {
      id: 7,
      question: 'Como faço para acessar o sistema acadêmico?',
      answer: 'Você pode acessar o sistema acadêmico que está disponível no menu usando sua matrícula e senha cadastrados. Em caso de problemas, entre em contato com a CRADT.',
      expanded: false
    },
    {
      id: 8,
      question: 'Quando serão divulgadas as notas?',
      answer: 'As notas serão divulgadas no QAcadêmico após o fechamento do semestre. Fique atento ao calendário acadêmico.',
      expanded: false
    },
    {
      id: 9,
      question: 'Como faço para obter uma declaração de matrícula?',
      answer: 'Você pode solicitar a declaração de matrícula pelo QAcadêmico ou diretamente com a CRADT.',
      expanded: false
    },
    {
      id: 10,
      question: 'Como faço para solicitar revisão de prova?',
      answer: 'Você deve entrar em contato com o professor responsável pela disciplina e seguir as orientações, caso ainda reste dúvidas você pode entrar em contato com a CRADT.',
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

  const handleSendEmail = () => {
    Alert.alert(
      'Enviar email',
      'Você deseja enviar um email para a equipe de desenvolvimento do app?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sim',
          onPress: () => {
            const email = 'csa8@discente.ifpe.edu.br';
            const subject = 'Feedback sobre o app';
            const body = 'Olá, equipe de desenvolvimento!\n\nGostaria de compartilhar o seguinte feedback:';
  
            const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            Linking.openURL(url);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <BackButton onPress={() => router.back()} />
        </View>
        <Text style={styles.headerTitle}>Suporte</Text>
      </View>
      
       <View style={styles.separator} />

       <View style={styles.content2}>     
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
          <View style={styles.faqHeader}>
            <Text style={styles.faqTitle}>Perguntas Frequentes:</Text>
            <TouchableOpacity style={{backgroundColor: '#e8f5e9'}}>
            </TouchableOpacity>
          </View>
          </View>

      <ScrollView style={styles.content}>
        
        <View style={styles.faqSection}>
          
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
        style={styles.contactButton}
        onPress={handleSendEmail}
      >
        <View style={styles.supportButtonContent}>
          <MaterialIcons name="email" size={24} color="#e8f5e9" style={styles.supportIcon} />
          <Text style={styles.supportButtonText}>Fale conosco</Text>
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
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
  },
  separator: {
    alignSelf:'center',
    width: "94%",
    height: 2,
    backgroundColor: "#000",
},
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom:10
  },
  content2: {
    paddingHorizontal: 16,
    paddingTop:16
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
    marginBottom: 10,
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
    backgroundColor: '#224805',
    paddingVertical: 15,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButton: {
    backgroundColor: '#224805',
    paddingVertical: 15,
    marginHorizontal: 16,
    marginBottom: 16,
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

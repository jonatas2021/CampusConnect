import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";

interface HolidayProps {
  month: string;
  day: string;
  name: string;
  type: string;
}

const CalendarScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [animatedHeight] = useState(new Animated.Value(80));

  const toggleDescription = (day: string) => {
    if (selectedDay === day) {
      Animated.timing(animatedHeight, {
        toValue: 80,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSelectedDay(null));
    } else {
      setSelectedDay(day);

      Animated.timing(animatedHeight, {
        toValue: 150,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const month = ["Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro",];

  const holidays: HolidayProps[] = [
    // ABRIL
    {
      day: "02",
      name: "Fim do Recesso Acadêmico",
      type: "Início/Fim do recesso",
      month: "Abril",
    },
    {
      day: "02",
      name: "Resultado da solicitação de Reabertura de Matrícula",
      type: "CRADT",
      month: "Abril",
    },
    {
      day: "03 a 06",
      name: "Matrícula Obrigatória para o próximo semestre/ano letivo",
      type: "CRADT",
      month: "Abril",
    },
    {
      day: "03 e 04",
      name: "Encontro pedagógico 2025.1",
      type: "Aula normal",
      month: "Abril",
    },
    {
      day: "07",
      name: "INÍCIO DO SEMESTRE LETIVO 2025.1",
      type: "Início/Fim do período",
      month: "Abril",
    },
    {
      day: "07",
      name: "Boas vindas às (aos) estudantes",
      type: "Eventos",
      month: "Abril",
    },
    {
      day: "14",
      name: "Último dia para entrega do Plano Individual de Trabalho",
      type: "CRADT",
      month: "Abril",
    },
    {
      day: "17",
      name: "Recesso escolar/administrativo",
      type: "Feriados",
      month: "Abril",
    },
    {
      day: "18",
      name: "Paixão de Cristo - Feriado Nacional",
      type: "Feriados",
      month: "Abril",
    },
    {
      day: "21",
      name: "Tiradentes - Feriado Nacional",
      type: "Feriados",
      month: "Abril",
    },
    {
      day: "28",
      name: "Início do período de ajuste de matrícula nos componentes curriculares (via formulário de requerimento)",
      type: "CRADT",
      month: "Abril",
    },

    // MAIO
    {
      day: "01",
      name: "Dia Mundial do Trabalho - Feriado Nacional",
      type: "Feriados",
      month: "Maio",
    },
    {
      day: "06 a 08",
      name: "Seminário de Agroecologia e Educação do Campo",
      type: "Eventos",
      month: "Maio",
    },
    {
      day: "09",
      name: "Último dia de Ajuste de matrícula nos componentes curriculares (via formulário de requerimento)",
      type: "CRADT",
      month: "Maio",
    },
    {
      day: "13",
      name: "Formatura dos Cursos",
      type: "Eventos",
      month: "Maio",
    },
    {
      day: "13 a 16",
      name: "Solicitação de isenção de componente curricular (via formulário de requerimento)",
      type: "CRADT",
      month: "Maio",
    },
    {
      day: "19",
      name: "Notificação de Evasão",
      type: "CRADT",
      month: "Maio",
    },
    {
      day: "19 a 23",
      name: "Semana contra LGBTfobia",
      type: "Eventos",
      month: "Maio",
    },
    {
      day: "31",
      name: "Último dia para solicitação de trancamento de matrícula e matrícula-vínculo - Veteranos (via formulário de requerimento)",
      type: "CRADT",
      month: "Maio",
    },

    // JUNHO
    {
      day: "11 e 12",
      name: "Semana da Diversidade",
      type: "Eventos",
      month: "Junho",
    },
    {
      day: "12",
      name: "Término da 1ª unidade letiva",
      type: "Início/Fim da unidade",
      month: "Junho",
    },
    {
      day: "12 e 13",
      name: "Resultado da solicitação de isenção de componente curricular",
      type: "CRADT",
      month: "Junho",
    },
    {
      day: "13",
      name: "Reunião dos Núcleos Docentes Estruturantes dos Cursos Superiores",
      type: "Reuniões",
      month: "Junho",
    },
    {
      day: "16 e 17",
      name: "Reunião dos Colegiados dos Cursos Superiores",
      type: "Reuniões",
      month: "Junho",
    },
    {
      day: "18",
      name: "Conselho de Classe dos Cursos Técnicos Subsequentes",
      type: "Reuniões",
      month: "Junho",
    },
    {
      day: "19",
      name: "Corpus Christi - Ponto facultativo",
      type: "Feriados",
      month: "Junho",
    },
    {
      day: "20",
      name: "Prazo final para atualização dos diários – 1ª Unidade Letiva",
      type: "CRADT",
      month: "Junho",
    },
    {
      day: "23",
      name: "Ponto facultativo",
      type: "Feriados",
      month: "Junho",
    },
    {
      day: "24",
      name: "São João - Feriado Estadual",
      type: "Feriados",
      month: "Junho",
    },
    {
      day: "25 e 26",
      name: "Período para requerimento da validação de conhecimentos e experiências anteriores (via formulário de requerimento)",
      type: "CRADT",
      month: "Junho",
    },

    // JULHO
    {
      day: "01 a 04",
      name: "Solicitação de reintegração curricular para o próximo semestre letivo (via formulário de requerimento)",
      type: "CRADT",
      month: "Julho",
    },
    {
      day: "01 a 04",
      name: "Solicitação de reopção de curso para o próximo semestre letivo (via formulário de requerimento)",
      type: "CRADT",
      month: "Julho",
    },
    {
      day: "01 a 04",
      name: "Solicitação de admissão por transferência entre Campi e de outros IF’s para o próximo semestre/ano letivo",
      type: "CRADT",
      month: "Julho",
    },
    {
      day: "01 a 04",
      name: "Solicitação de mudança de turno para o próximo semestre letivo (via formulário de requerimento)",
      type: "CRADT",
      month: "Julho",
    },
    {
      day: "13 a 19",
      name: "77ª Reunião Anual da SBPC",
      type: "Eventos",
      month: "Julho",
    },
    {
      day: "21 e 22",
      name: "Resultado da validação de conhecimentos e experiências anteriores",
      type: "CRADT",
      month: "Julho",
    },

    // AGOSTO
    {
      day: "04 a 05",
      name: "Resultado das solicitações de reintegração curricular e admissão por transferência entre Campi e de outros IF’s para o próximo semestre/ano letivo",
      type: "CRADT",
      month: "Agosto",
    },
    {
      day: "06 a 13",
      name: "Solicitação de reabertura de matrícula para 2025.2 para alunos com matrículas trancadas",
      type: "CRADT",
      month: "Agosto",
    },
    {
      day: "14 e 15",
      name: "Demo Week",
      type: "Eventos",
      month: "Agosto",
    },
    {
      day: "15",
      name: "Término da 2ª unidade letiva",
      type: "Início/Fim da unidade",
      month: "Agosto",
    },
    {
      day: "19",
      name: "Reunião dos Núcleos Docentes Estruturantes dos Cursos Superiores",
      type: "Reuniões",
      month: "Agosto",
    },
    {
      day: "20 e 21",
      name: "Exames Finais",
      type: "Provas",
      month: "Agosto",
    },
    {
      day: "22",
      name: "Conselho de Classe dos Cursos Técnicos Subsequentes",
      type: "Reuniões",
      month: "Agosto",
    },
    {
      day: "25",
      name: "Reunião dos Colegiados dos Cursos Superiores",
      type: "Reuniões",
      month: "Agosto",
    },
    {
      day: "25",
      name: "Último dia para envio do relatório de atividades docentes",
      type: "CRADT",
      month: "Agosto",
    },
    {
      day: "25",
      name: "Prazo final para atualização dos diários – 2ª Unidade Letiva",
      type: "CRADT",
      month: "Agosto",
    },
    {
      day: "25",
      name: "Fechamento do Semestre no Q-acadêmico",
      type: "CRADT",
      month: "Agosto",
    },
    {
      day: "25",
      name: "Encerramento do semestre letivo 2025.1",
      type: "Início/Fim do período",
      month: "Agosto",
    },
    {
      day: "26",
      name: "Início do Recesso Acadêmico",
      type: "Início/Fim do recesso",
      month: "Agosto",
    },

    // SETEMBRO
    {
      day: "01",
      name: "Resultado da solicitação de Reabertura de Matrícula",
      type: "CRADT",
      month: "Setembro",
    },
    {
      day: "08 e 09",
      name: "Matrícula Obrigatória para o próximo semestre/ano letivo",
      type: "CRADT",
      month: "Setembro",
    },
    {
      day: "09",
      name: "Fim do Recesso Acadêmico",
      type: "Início/Fim do recesso",
      month: "Setembro",
    },
    {
      day: "10 e 11",
      name: "Encontro pedagógico 2025.2",
      type: "Aula normal",
      month: "Setembro",
    },
    {
      day: "12",
      name: "INÍCIO DO SEMESTRE LETIVO 2025.2",
      type: "Início/Fim do período",
      month: "Setembro",
    },
  ];

  const holidayType = [
    { type: "Início/Fim do período", color: "#92C36B" },
    { type: "Aula normal", color: "#FFF" },
    { type: "Início/Fim da unidade", color: "#57753D" },
    { type: "CRADT", color: "#FFEF44" },
    { type: "Início/Fim do recesso", color: "#E798C5" },
    { type: "Feriados", color: "#E56B6B" },
    { type: "Eventos", color: "#9463FF" },
    { type: "Reuniões", color: "#EF7C52" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Calendário 2024.2</Text>
      <View style={styles.separator} />
      <Text style={styles.lastUpdate}>Última atualização: 25/03/2025</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* months and days */}
        <View style={styles.monthsContainer}>
          {month.map((month, index) => (
            <View key={index} style={styles.monthContainer}>
              <View style={styles.monthBox}>
                <Text style={styles.monthText}>{month}</Text>
              </View>

              <View style={styles.dayContainer}>
                {holidays
                  .filter((Holiday) => Holiday.month === month)
                  .map((Holiday, i) => {
                    const isSelected = selectedDay === Holiday.day;
                    return (
                      <Animated.View
                        key={i}
                        style={[
                          styles.dayBox,
                          {
                            backgroundColor: holidayType.find(
                              (t) => t.type === Holiday.type
                            )?.color,
                            height: isSelected ? animatedHeight : 80,
                          },
                        ]}
                      >
                        <TouchableOpacity
                          style={styles.touchable}
                          onPress={() => toggleDescription(Holiday.day)}
                        >
                          <View style={styles.dayContent}>
                            <Text style={styles.dayText}>{Holiday.day}</Text>
                            <Text style={styles.dayTypeText}>
                              {Holiday.type}
                            </Text>
                          </View>
                          {isSelected && (
                            <Text style={styles.descriptionText}>
                              {Holiday.name}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.separator2} />
        <View style={styles.holidayTypeContainer}>
          {holidayType.map((item, index) => (
            <View key={index} style={styles.typeHolidayBox}>
              <View
                style={[styles.typeColorBox, { backgroundColor: item.color }]}
              />
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    marginBottom: 5,
  },
  separator2: {
    width: "120%",
    height: 2,
    backgroundColor: "#000",
    marginBottom: 5,
    alignSelf: 'center'
  },
  lastUpdate: {
    fontSize: RFValue(12),
    color: "#888",
    textAlign: "right",
    marginBottom: 15,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  monthsContainer: {
    flexDirection: "column",
  },
  monthContainer: {
    marginBottom: 2,
  },
  monthBox: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#000",
  },
  monthText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  dayBox: {
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
  },
  touchable: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dayContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginLeft: "10%",
  },
  dayText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
    textAlign: "left",
  },
  dayTypeText: {
    fontSize: 18,
    color: "black",
    textAlign: "left",
  },
  descriptionText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  holidayTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 30,
    paddingHorizontal: 15,
  },

  typeHolidayBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "25%",
    marginBottom: 15,
    marginRight: "25%",
  },

  typeColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
  },

  typeText: {
    fontSize: RFValue(10),
    color: "#000",
    textAlign: "left",
  },
});

export default CalendarScreen;

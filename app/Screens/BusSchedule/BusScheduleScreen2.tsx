import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity, Image
} from "react-native";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";
import { fetchBusSchedule } from "@/src/services/busSchedule2";

interface BusTimeProps {
  departure: string;
  arrival: string;
}

type ScheduleKey =
  | "monday"
  | "tuesdayToThursday"
  | "fridayAndSaturday";

const BusScheduleScreen2: React.FC = () => {
  const [selectedDay, setSelectedDay] =
    useState<ScheduleKey>("tuesdayToThursday");

  const [schedules, setSchedules] = useState<Record<ScheduleKey, BusTimeProps[]>>({
    monday: [],
    tuesdayToThursday: [],
    fridayAndSaturday: [],
  });

  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      const result = await fetchBusSchedule();

      if (result?.data) {
        setSchedules(result.data);
        setLastUpdate(result.lastUpdate);
      }

      setLoading(false);
    };

    loadSchedules();
  }, []);

  const getSchedules = () => schedules[selectedDay] ?? [];

  if (loading) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Image source={require('../../../assets/images/Loading.gif')} style={{width: '40%', height: '20%'}} resizeMode="contain"/>

      <Text style={{ marginTop: 20, fontSize: 18, color: "#2A5224" }}>
        Carregando horários...
      </Text>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <Text style={styles.title}>Rodotur - Recife / Goiana</Text>
      <View style={styles.separator} />

      <Text style={styles.subtitle}>
        Em vigor desde{" "}
        {lastUpdate
          ? new Date(lastUpdate).toLocaleDateString("pt-BR")
          : "–"}
      </Text>

      {/* Botões */}
      <View style={styles.selectionContainer}>
        <Text style={styles.weekdayText}>Horários de:</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "monday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("monday")}
          >
            <Text style={styles.buttonText}>Seg</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "tuesdayToThursday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("tuesdayToThursday")}
          >
            <Text style={styles.buttonText}>Ter à Qui</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "fridayAndSaturday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("fridayAndSaturday")}
          >
            <Text style={styles.buttonText}>Sex e Sáb</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Saída de Goiana</Text>
        </View>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Saída do Recife</Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            {getSchedules().map((schedule, index) => (
              <View key={`dep-${index}`} style={styles.timeBox}>
                <Text style={styles.timeText}>{schedule.departure}</Text>
              </View>
            ))}
          </View>

          <View style={styles.column}>
            {getSchedules().map((schedule, index) => (
              <View key={`arr-${index}`} style={styles.timeBox}>
                <Text style={styles.timeText}>{schedule.arrival}</Text>
              </View>
            ))}
          </View>
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
  subtitle: {
    fontSize: RFValue(12),
    color: "#888",
    textAlign: "right",
    marginBottom: 15,
  },
  selectionContainer: {
    flexDirection: "row", // Alinha o texto e os botões na mesma linha
    alignItems: "center", // Alinha verticalmente
    gap: 6, // Espaçamento entre os botões
    marginBottom: 12,
    justifyContent: "center"
  },
  weekdayText: {
    fontSize: RFValue(17),
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8, // Espaçamento entre os botões
  },
  button: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center', // Alinha verticalmente
    alignItems: 'center', // Alinha horizontalmente
  },
  buttonSelected: {
    backgroundColor: "#92C36B",
  },
  buttonText: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#000",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  headerBox: {
    flex: 1,
    backgroundColor: '#2A5224',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    gap: 8,
  },
  column: {
    backgroundColor: "#1B5E20",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flex: 1,
  },
  timeBox: {
    backgroundColor: '#92C36B',
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  headerText: {
    color: "white",
    fontSize: RFValue(16),
    fontWeight: "bold",
    textAlign: "center",
  },
  timeText: {
    color: "white",
    fontSize: RFValue(16),
    fontWeight: "bold",
  },
});

export default BusScheduleScreen2;

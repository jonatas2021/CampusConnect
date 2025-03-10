import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";

interface BusTimeProps {
  departure: string;
  arrival: string;
}

const mondaySchedules: BusTimeProps[] = [
  { departure: "04:30", arrival: "05:00" },
  { departure: "05:00", arrival: "05:30" },
  { departure: "05:30", arrival: "06:00" },
  { departure: "05:45", arrival: "06:20" },
  { departure: "06:00", arrival: "06:40" },
  { departure: "06:15", arrival: "07:00" },
  { departure: "06:30", arrival: "07:30" },
  { departure: "06:45", arrival: "08:00" },
  { departure: "07:00", arrival: "08:30" },
  { departure: "07:20", arrival: "09:00" },
  { departure: "07:40", arrival: "09:30" },
  { departure: "08:00", arrival: "10:00" },
  { departure: "08:30", arrival: "10:00" },
  { departure: "09:00", arrival: "11:00" },
  { departure: "09:30", arrival: "11:30" },
  { departure: "10:00", arrival: "12:00" },
  { departure: "10:30", arrival: "12:30" },
  { departure: "11:00", arrival: "13:00" },
  { departure: "11:30", arrival: "13:30" },
  { departure: "12:00", arrival: "14:00" },
  { departure: "13:00", arrival: "14:30" },
  { departure: "14:00", arrival: "15:00" },
  { departure: "14:30", arrival: "15:20" },
  { departure: "15:00", arrival: "15:40" },
  { departure: "15:30", arrival: "16:00" },
  { departure: "16:00", arrival: "16:30" },
  { departure: "16:30", arrival: "17:00" },
  { departure: "17:00", arrival: "17:30" },
  { departure: "18:00", arrival: "18:00" }
]



const tuesdayTothursday: BusTimeProps[] = [
  { departure: "05:00", arrival: "05:00" },
  { departure: "05:30", arrival: "05:30" },
  { departure: "06:00", arrival: "06:00" },
  { departure: "06:30", arrival: "06:30" },
  { departure: "07:00", arrival: "07:00" },
  { departure: "07:30", arrival: "07:30" },
  { departure: "08:00", arrival: "08:00" },
  { departure: "08:30", arrival: "09:00" },
  { departure: "09:00", arrival: "10:00" },
  { departure: "10:00", arrival: "11:00" },
  { departure: "11:00", arrival: "12:00" },
  { departure: "12:00", arrival: "13:00" },
  { departure: "13:00", arrival: "13:30" },
  { departure: "13:30", arrival: "14:00" },
  { departure: "14:00", arrival: "14:30" },
  { departure: "14:30", arrival: "15:00" },
  { departure: "15:00", arrival: "15:30" },
  { departure: "15:30", arrival: "16:00" },
  { departure: "16:00", arrival: "16:30" },
  { departure: "16:30", arrival: "17:00" },
  { departure: "17:00", arrival: "17:30" },
  { departure: "18:00", arrival: "18:00" }
]


const fridayAndsaturday: BusTimeProps[] = [
  { departure: "05:00", arrival: "05:00" },
  { departure: "05:30", arrival: "05:30" },
  { departure: "06:00", arrival: "06:00" },
  { departure: "06:30", arrival: "06:30" },
  { departure: "07:00", arrival: "07:00" },
  { departure: "07:30", arrival: "07:30" },
  { departure: "08:00", arrival: "08:00" },
  { departure: "08:30", arrival: "08:30" },
  { departure: "09:00", arrival: "09:00" },
  { departure: "09:30", arrival: "09:30" },
  { departure: "10:00", arrival: "10:00" },
  { departure: "10:30", arrival: "10:30" },
  { departure: "11:00", arrival: "11:00" },
  { departure: "11:30", arrival: "11:30" },
  { departure: "12:00", arrival: "12:00" },
  { departure: "12:30", arrival: "12:30" },
  { departure: "13:00", arrival: "13:00" },
  { departure: "13:30", arrival: "11:30" },
  { departure: "14:00", arrival: "14:00" },
  { departure: "14:30", arrival: "14:30" },
  { departure: "15:00", arrival: "15:00" },
  { departure: "15:30", arrival: "15:30" },
  { departure: "16:00", arrival: "16:00" },
  { departure: "16:30", arrival: "16:30" },
  { departure: "17:00", arrival: "17:00" },
  { departure: "18:00", arrival: "17:30" },
  { departure: "--:--", arrival: "18:00" }
]



const BusScheduleScreen2: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<"monday" | "tuesdayTothursday" | "saturday" >("tuesdayTothursday");

  const getSchedules = () => {
    switch (selectedDay) {
      case "monday":
        return mondaySchedules;
      case "tuesdayTothursday":
        return tuesdayTothursday;
      case "saturday":
      default:
        return fridayAndsaturday;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Rodotur - Recife / Goiana</Text>
      <View style={styles.separator} />
      <Text style={styles.subtitle}>Em vigor desde 01 de julho de 2024</Text>

      {/* Botões de seleção */}
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
              selectedDay === "tuesdayTothursday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("tuesdayTothursday")}
          >
            <Text style={styles.buttonText}>Ter à Qui</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "saturday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("saturday")}
          >
            <Text style={styles.buttonText}>Sex e Sáb</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Header Boxes */}
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Saída de Goiana</Text>
        </View>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Saída do Recife</Text>
        </View>
      </View>

      <ScrollView>
        {/* Time Columns */}
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

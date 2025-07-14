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

const weekdaySchedules: BusTimeProps[] = [
  { departure: "04:00", arrival: "04:20" },
  { departure: "04:35", arrival: "04:55" },
  { departure: "05:10", arrival: "05:30" },
  { departure: "05:45", arrival: "06:05" },
  { departure: "06:20", arrival: "06:40" },
  { departure: "06:55", arrival: "07:15" },
  { departure: "07:35", arrival: "07:55" },
  { departure: "08:10", arrival: "08:30" },
  { departure: "09:15", arrival: "09:35" },
  { departure: "09:45", arrival: "10:05" },
  { departure: "10:50", arrival: "11:10" },
  { departure: "11:20", arrival: "11:40" },
  { departure: "12:00", arrival: "12:20" },
  { departure: "12:30", arrival: "12:50" },
  { departure: "13:15", arrival: "13:35" },
  { departure: "13:45", arrival: "14:05" },
  { departure: "14:55", arrival: "15:15" },
  { departure: "15:30", arrival: "15:50" },
  { departure: "16:05", arrival: "16:25" },
  { departure: "16:45", arrival: "17:05" },
  { departure: "17:25", arrival: "17:45" },
  { departure: "18:05", arrival: "18:25" },
  { departure: "18:45", arrival: "19:05" },
  { departure: "19:20", arrival: "19:40" },
  { departure: "20:30", arrival: "20:50" },
  { departure: "21:00", arrival: "21:20" },
  { departure: "22:00", arrival: "22:20" },
];

const saturdaySchedules: BusTimeProps[] = [
  { departure: "04:30", arrival: "04:50" },
  { departure: "05:30", arrival: "05:50" },
  { departure: "06:30", arrival: "06:50" },
  { departure: "07:30", arrival: "07:50" },
  { departure: "09:30", arrival: "09:50" },
  { departure: "10:30", arrival: "10:50" },
  { departure: "11:30", arrival: "11:50" },
  { departure: "12:30", arrival: "12:50" },
  { departure: "14:30", arrival: "14:50" },
  { departure: "15:30", arrival: "15:50" },
  { departure: "16:30", arrival: "16:50" },
  { departure: "17:30", arrival: "17:50" },
  { departure: "18:30", arrival: "18:50" },
  { departure: "19:25", arrival: "19:45" },
  { departure: "21:10", arrival: "21:30" },
  { departure: "22:00", arrival: "22:20" },

];

const BusScheduleScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<"weekday" | "weekend">("weekday");

  const getSchedules = () => {
    switch (selectedDay) {
      case "weekday":
        return weekdaySchedules;
      case "weekend":
        return saturdaySchedules;
      default:
        return weekdaySchedules;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>TI Igarassu / Botafogo</Text>
      <View style={styles.separator} />
      <Text style={styles.subtitle}>Em vigor desde 14 de julho de 2025</Text>

      {/* Botões de seleção */}
      <View style={styles.selectionContainer}>
        <Text style={styles.weekdayText}>Horários de:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "weekday" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("weekday")}
          >
            <Text style={styles.buttonText}>Seg a Sex</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedDay === "weekend" && styles.buttonSelected,
            ]}
            onPress={() => setSelectedDay("weekend")}
          >
            <Text style={styles.buttonText}>Sáb e Dom</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Header Boxes */}
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Saída do terminal</Text>
        </View>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Chegada ao IFPE</Text>
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

export default BusScheduleScreen;

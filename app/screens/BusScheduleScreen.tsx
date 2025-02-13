import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";

interface BusTimeProps {
  departure: string;
  arrival: string;
}

const BusScheduleScreen: React.FC = () => {
  const schedules: BusTimeProps[] = [
    { departure: "04:10", arrival: "04:30" },
    { departure: "04:45", arrival: "05:05" },
    { departure: "05:50", arrival: "06:10" },
    { departure: "06:25", arrival: "06:45" },
    { departure: "07:00", arrival: "07:20" },
    { departure: "07:30", arrival: "07:50" },
    { departure: "08:10", arrival: "08:30" },
    { departure: "09:15", arrival: "09:35" },
    { departure: "10:50", arrival: "11:10" },
    { departure: "11:20", arrival: "11:50" },
    { departure: "11:55", arrival: "12:15" },
    { departure: "12:30", arrival: "12:50" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Horários do ônibus</Text>
        <Text style={styles.subtitle}>Em vigor desde 01 de janeiro de 2024</Text>

        <Text style={styles.weekdayText}>Horários de seg a sex:</Text>

        {/* Header Boxes */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>Saída do terminal</Text>
          </View>
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>Chegada ao IFPE</Text>
          </View>
        </View>

        {/* Time Columns */}
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            {schedules.map((schedule, index) => (
              <View key={`dep-${index}`} style={styles.timeBox}>
                <Text style={styles.timeText}>{schedule.departure}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.column}>
            {schedules.map((schedule, index) => (
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
    backgroundColor: "#e6f2e6",
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    color: "#666",
  },
  weekdayText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 22,
    marginBottom: 16,
    color: "#333",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  headerBox: {
    flex: 1,
    backgroundColor: '#2A5224',
    borderRadius: 12,
    padding: 26,
    alignItems: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    gap: 8,
  },
  column: {
    flex: 1,
    backgroundColor: '#2A5224',
    borderRadius: 12,
    padding: 16,
  },
  timeBox: {
    backgroundColor: '#92C36B',
    borderRadius: 6,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  timeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default BusScheduleScreen;

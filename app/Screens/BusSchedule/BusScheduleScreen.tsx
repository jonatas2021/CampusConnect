import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
} from "react-native";
import BackButton from "@/components/BackButton";
import { RFValue } from "react-native-responsive-fontsize";


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
    { departure: "13:10", arrival: "13:30" },
    { departure: "13:45", arrival: "14:05" },
    { departure: "14:50", arrival: "15:10" },
    { departure: "15:20", arrival: "15:40" },
    { departure: "16:00", arrival: "16:20" },
    { departure: "16:35", arrival: "16:55" },
    { departure: "17:15", arrival: "17:35" },
    { departure: "17:50", arrival: "18:10" },
    { departure: "18:30", arrival: "18:50" },
    { departure: "19:05", arrival: "19:25" },
    { departure: "20:10", arrival: "20:30" },
    { departure: "20:45", arrival: "21:05" },
    { departure: "21:20", arrival: "21:40" },
    { departure: "22:00", arrival: "22:20" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
        <Text style={styles.title}>TI Igarassu / Botafogo</Text>
        <View style={styles.separator} />
        <Text style={styles.subtitle}>Em vigor desde 01 de julho de 2024</Text>

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
        
        <ScrollView>
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
  weekdayText: {
    fontSize: RFValue(17),
    fontWeight: "bold",
    marginLeft: 22,
    marginBottom: 16,
    color: "#333",
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

import React, { useEffect, useState } from 'react';
import { } from 'react-native'; import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import data from './data/data';
import BackButton from "@/components/BackButton2";
import { RFValue } from "react-native-responsive-fontsize";

// Mapeamento dos horários automáticos
const TIME_MAP: Record<string, { start: string; end: string }> = {
  '1m': { start: '07:00', end: '07:50' },
  '2m': { start: '07:50', end: '08:40' },
  '3m': { start: '08:40', end: '09:30' },
  '4m': { start: '09:50', end: '10:40' },
  '5m': { start: '10:40', end: '11:30' },
  '1t': { start: '13:00', end: '13:50' },
  '2t': { start: '13:50', end: '14:40' },
  '3t': { start: '14:40', end: '15:30' },
  '4t': { start: '15:50', end: '16:40' },
  '5t': { start: '16:40', end: '17:30' },
};

const Aulas = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const loadAvailablePeriods = (course: string) => {
    try {
      const courseData = data[course.toLowerCase()];
      if (courseData) {
        const periods = Object.keys(courseData);
        setAvailablePeriods(periods);
        setSelectedPeriod(null);
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('Erro ao carregar períodos:', error);
    }
  };

  const loadSchedule = (course: string, period: string, day: string) => {
    try {
      const courseData = data[course.toLowerCase()];
      const filtered = courseData?.[period]?.[day.toLowerCase()] || [];
      setSchedule(filtered);
    } catch (error) {
      console.error('Erro ao carregar o horário:', error);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      loadAvailablePeriods(selectedCourse);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse && selectedPeriod && selectedDay) {
      loadSchedule(selectedCourse, selectedPeriod, selectedDay);
    }
  }, [selectedCourse, selectedPeriod, selectedDay]);

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Estagio</Text>
      <View style={styles.separator} />
      {/* Seleção de Curso */}
      <View style={styles.selectionContainer}>
        {['IPI', 'TSI', 'LOG', 'ADM', 'GQ'].map((course) => (
          <TouchableOpacity key={course} onPress={() => setSelectedCourse(course)}>
            <Text style={[styles.option, selectedCourse === course && styles.dayButtonSelected]}>
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seleção de Período */}
      {availablePeriods.length > 0 && (
        <View style={styles.selectionContainer}>
          {availablePeriods.map((period) => (
            <TouchableOpacity key={period} onPress={() => setSelectedPeriod(period)}>
              <Text style={[styles.option, selectedPeriod === period && styles.dayButtonSelected]}>
                {period}º período
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Seleção de Dias */}
      {selectedPeriod && (
        <View style={styles.daysContainer}>
          {['seg', 'ter', 'qua', 'qui', 'sex'].map((day) => (
            <TouchableOpacity key={day} onPress={() => setSelectedDay(day)} style={[
              styles.dayButton,
              selectedDay === day && styles.dayButtonSelected
            ]}>
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quadro de Horário */}
      <FlatList
        data={schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const time = TIME_MAP[item.time] || { start: '--:--', end: '--:--' };
          return (
            <View style={styles.scheduleItem}>
              <View style={styles.time}>
                <Text>{time.start}</Text>
                <Text>{time.end}</Text>
              </View>
              <View style={styles.subjectContainer}>
                <Text style={styles.subject}>{item.subject}</Text>
                <Text style={styles.teacher}>{item.teacher}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "6%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "4%",
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dropdown: {
    padding: 12,
    backgroundColor: '#eee',
    marginBottom: 8
  },
  option: {
    padding: 12,
    backgroundColor: '#ddd'
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  dayButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5
  },
  dayButtonSelected: {
    backgroundColor: '#aaa'
  },
  dayText: {
    color: '#000'
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 12
  },
  time: {
    width: 100,
    fontWeight: 'bold'
  },
  subjectContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 5
  },
  subject: {
    fontWeight: 'bold'
  },
  teacher: {
    color: '#555'
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
    alignSelf: 'center',
},
});

export default Aulas;

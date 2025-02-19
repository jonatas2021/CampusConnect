import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

export default function ChatHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Suporte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
});

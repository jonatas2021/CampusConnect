import React from "react";
import { View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface ChatHeaderProps {
  title?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function ChatHeader({ headerLeft, headerRight }: ChatHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {headerLeft && <View style={styles.headerLeft}>{headerLeft}</View>}
      {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    position: "absolute",
    left: 16,
  },
  headerRight: {
    position: "absolute",
    right: 16,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    alignSelf: "center",
  },
});

import React, { useState, useRef, useCallback } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textInputRef = useRef<TextInput>(null);

  const handleSend = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSend(trimmedText);
      setText("");
      textInputRef.current?.focus();
    }
  }, [text, onSend]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escreva um comentário"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSend}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <MaterialCommunityIcons name="send" color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#2A5224",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 42,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  button: {
    backgroundColor: "#66bb6a",
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowRadius: 5,
    elevation: 6,
    overflow: "hidden",
    marginLeft: 10,
  },
});

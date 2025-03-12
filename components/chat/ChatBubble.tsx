import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

interface MessageProps {
  text: string;
  role: "user" | "assistant";
  time: string;
}

export default function ChatBubble({ message }: { message: MessageProps }) {
  const isUser = message.role === "user";
  const [typingDots, setTypingDots] = useState(".");
  
  // Animação simples para o texto "Escrevendo..."
  useEffect(() => {
    if (!isUser && message.text.trim() === "") {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === ".") return "..";
          if (prev === "..") return "...";
          return ".";
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isUser, message.text]);

  return (
    <View style={styles.messageContainer}>
      <View style={[styles.bubbleContainer, isUser ? styles.userBubble : styles.supportBubble]}>
        {!isUser && message.text.trim() === "" ? (
          <Text style={styles.supportMessageText}>
            Escrevendo{typingDots}
          </Text>
        ) : (
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.supportMessageText]}>
            {message.text}
          </Text>
        )}
      </View>
      <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.supportTimeText]}>
        {message.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    width: "100%",
  },
  bubbleContainer: {
    padding: 12,
    borderRadius: 24,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#2A5224",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
    marginLeft: "20%",
  },
  supportBubble: {
    backgroundColor: "#DEFCC7",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    marginRight: "20%",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#fff",
    fontWeight: "500",
  },
  supportMessageText: {
    color: "#000",
    fontWeight: "500",
  },
  timeText: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  userTimeText: {
    alignSelf: "flex-end",
    marginRight: 4,
  },
  supportTimeText: {
    alignSelf: "flex-start",
    marginLeft: 4,
  },
});

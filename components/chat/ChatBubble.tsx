import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageProps {
  text: string;
  sender: 'user' | 'support';
  time: string;
}

export default function ChatBubble({ message }: { message: MessageProps }) {
  // message: { text: string, sender: 'user' | 'support', time: string }
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.bubbleContainer, isUser ? styles.userBubble : styles.supportBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.supportMessageText]}>{message.text}</Text>
      <Text style={styles.timeText}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 20,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 24,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#2A5224',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#DEFCC7',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 18,
  },
  userMessageText: {
    color: '#fff',
    fontWeight: "bold",
    marginBottom: 8,
  },
  supportMessageText: {
    marginBottom: 8,
    color: '#000',
    fontWeight: "bold"
  },
  timeText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
    textAlign: 'right',
  },
});

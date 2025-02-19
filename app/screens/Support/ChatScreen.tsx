import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';

import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MessageProps {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      text: 'Hi Kitsbase, Let me know you need help and you can ask us any questions.',
      sender: 'support',
      time: '08:20 AM',
    },
    {
      id: '2',
      text: 'How to create a FinX Stock account?',
      sender: 'user',
      time: '08:21 AM',
    },
    {
      id: '3',
      text: `Open the FinX Stock app to get started and follow the steps. FinX Stock doesn’t charge a fee to create or maintain your FinX Stock account.`,
      sender: 'support',
      time: '08:22 AM',
    },
  ]);

  const handleSend = (text: string) => {
    const newMessage: MessageProps = {
      id: String(messages.length + 1),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton />
        <ChatHeader />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
      />
      <ChatInput onSend={handleSend} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: "4%",
    paddingTop: "10%",
  },
  headerContainer: {
    //
  },
  chatContainer: {
    paddingVertical: 8,
    paddingBottom: 60,
  },
});

import React, { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import { 
  generateResponseStreamWrapper,
  ChatMessage
} from "@/scripts/models";

export interface MessageProps {
  id: string;
  text: string;
  role: "user" | "assistant";
  time: string;
}

interface ChatViewProps {
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  selectedModel: string | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onModelError: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  setMessages,
  selectedModel,
  isLoading,
  setIsLoading,
  onModelError,
}) => {
  const flatListRef = useRef<FlatList>(null);

  // Handle sending a message
  const handleSend = async (text: string) => {
    if (!selectedModel) {
      return;
    }

    const userMessage: MessageProps = {
      id: `${Date.now()}`,
      text,
      role: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const modelPath = `${FileSystem.documentDirectory}models/${selectedModel}`;
      
      // Verify model file exists and is valid before attempting to use it
      const fileInfo = await FileSystem.getInfoAsync(modelPath, { size: true });
      if (!fileInfo.exists || !fileInfo.size) {
        throw new Error("Model file not found or is empty. Please re-download the model.");
      }
      
      const systemMessage: ChatMessage = {
        role: "system",
        content: "You are a helpful assistant.",
      };
      const fullMessages: ChatMessage[] = [
        systemMessage,
        ...messages.map((msg) => ({ role: msg.role, content: msg.text }) as ChatMessage),
        { role: "user", content: text },
      ];

      // Create a placeholder assistant message for the streamed response
      const assistantId = `${Date.now() + 1}`;
      const supportMessage: MessageProps = {
        id: assistantId,
        text: "",
        role: "assistant",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, supportMessage]);

      // Use the non-streaming version - the wrapper now returns the full response in one go
      try {
        const stream = generateResponseStreamWrapper(fullMessages, modelPath);
        
        // Aguarde a resposta completa
        const response = await (async () => {
          for await (const chunk of stream) {
            return chunk; // Retorna o primeiro (e único) chunk, que é a resposta completa
          }
          return "";
        })();
        
        // Atualiza a mensagem do assistente com a resposta completa
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantId) {
              return { ...msg, text: response };
            }
            return msg;
          })
        );
      } catch (modelError) {
        console.error("Error generating response:", modelError);
        
        // Update the assistant message to show the error
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantId) {
              return { 
                ...msg, 
                text: "Erro ao carregar o modelo. O arquivo do modelo pode estar corrompido. Por favor, tente baixar o modelo novamente." 
              };
            }
            return msg;
          })
        );
        
        // Show error alert and prompt to re-download
        Alert.alert(
          "Erro no Modelo",
          "Ocorreu um erro ao usar o modelo. O arquivo pode estar corrompido ou incompleto.",
          [
            { 
              text: "Baixar Novamente", 
              onPress: onModelError
            },
            { text: "OK" }
          ]
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      // Add a slight delay to ensure the view has rendered the new message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.chatListContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      </View>
      <View style={styles.inputContainer}>
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatListContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 90
  },
  chatContainer: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  inputContainer: {
    position: 'fixed'
  },
});

export default ChatView; 
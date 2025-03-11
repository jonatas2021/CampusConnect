import ChatHeader from "@/components/chat/ChatHeader";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { generateResponse, availableModels, ChatMessage } from "@/scripts/llm";

interface MessageProps {
  id: string;
  text: string;
  role: "user" | "assistant";
  time: string;
}

async function* generateResponseStreamWrapper(fullMessages: ChatMessage[], modelPath: string) {
  // Call the standard generateResponse to get the complete response
  const fullResponse = await generateResponse(fullMessages, modelPath);
  // Split the response by spaces to simulate streaming word-by-word
  const words = fullResponse.split(" ");
  for (const word of words) {
    yield word + " ";
    // Add a small delay to simulate streaming
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export default function ChatScreen() {
  const router = useRouter();

  // State management
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modelStatuses, setModelStatuses] = useState<{
    [key: string]: "not_downloaded" | "downloading" | "downloaded";
  }>({});
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});

  const flatListRef = useRef<FlatList>(null);

  // Check for downloaded models on mount
  useEffect(() => {
    const checkModels = async () => {
      const statuses: {
        [key: string]: "not_downloaded" | "downloading" | "downloaded";
      } = {};
      for (const model of availableModels) {
        const path = `${FileSystem.documentDirectory}models/${model.name}`;
        const fileInfo = await FileSystem.getInfoAsync(path);
        statuses[model.name] = fileInfo.exists
          ? "downloaded"
          : "not_downloaded";
      }
      setModelStatuses(statuses);

      const downloadedModel = availableModels.find(
        (m) => statuses[m.name] === "downloaded",
      );
      if (downloadedModel) {
        setSelectedModel(downloadedModel.name);
      } else {
        setModalVisible(true);
      }
    };
    checkModels();
  }, []);

  // Handle model download with progress
  const handleDownload = async (model: (typeof availableModels)[0]) => {
    setModelStatuses((prev) => ({ ...prev, [model.name]: "downloading" }));
    setDownloadProgress((prev) => ({ ...prev, [model.name]: 0 }));
    const path = `${FileSystem.documentDirectory}models/${model.name}`;
    try {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}models`,
        { intermediates: true },
      );
      const downloadResumable = FileSystem.createDownloadResumable(
        model.url,
        path,
        {},
        (progress) => {
          const percentage =
            progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress((prev) => ({
            ...prev,
            [model.name]: percentage,
          }));
        },
      );
      await downloadResumable.downloadAsync();
      setModelStatuses((prev) => ({ ...prev, [model.name]: "downloaded" }));
      if (!selectedModel) {
        setSelectedModel(model.name);
        setModalVisible(false);
      }
    } catch (error) {
      setModelStatuses((prev) => ({ ...prev, [model.name]: "not_downloaded" }));
      console.error("Download failed:", error);
    }
  };

  // Handle model removal
  const handleRemove = async (modelName: string) => {
    const path = `${FileSystem.documentDirectory}models/${modelName}`;
    try {
      await FileSystem.deleteAsync(path);
      setModelStatuses((prev) => ({ ...prev, [modelName]: "not_downloaded" }));
      if (selectedModel === modelName) {
        setSelectedModel(null);
        const remainingModel = availableModels.find(
          (m) => modelStatuses[m.name] === "downloaded" && m.name !== modelName,
        );
        if (remainingModel) {
          setSelectedModel(remainingModel.name);
        } else {
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  // Handle sending a message
  const handleSend = async (text: string) => {
    if (!selectedModel) {
      setModalVisible(true);
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

      // Use the streaming version by calling the wrapper
      const stream = generateResponseStreamWrapper(fullMessages, modelPath);
      for await (const chunk of stream) {
        // Update the assistant's message text incrementally
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantId) {
              return { ...msg, text: msg.text + chunk };
            }
            return msg;
          })
        );
      }
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage: MessageProps = {
        id: `${Date.now() + 1}`,
        text: "Sorry, I couldn't generate a response. Please try again.",
        role: "assistant",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    <SafeAreaView style={styles.container}>
      <ChatHeader
        headerLeft={<BackButton onPress={() => router.back()} />}
        headerRight={
          <TouchableOpacity style={styles.modelsButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.modelsButtonText}>Models</Text>
          </TouchableOpacity>
        }
      />
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

      {/* Model Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma IA</Text>
            {availableModels.map((model) => (
              <View key={model.name} style={styles.modelItem}>
                <Text style={styles.modelName}>
                  {model.name} ({model.size})
                </Text>
                {modelStatuses[model.name] === "downloading" ? (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(downloadProgress[model.name] || 0) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text>
                      {((downloadProgress[model.name] || 0) * 100).toFixed(1)}%
                    </Text>
                  </View>
                ) : modelStatuses[model.name] === "downloaded" ? (
                  <View style={styles.modelActions}>
                    <TouchableOpacity
                      style={[styles.modalButton, selectedModel === model.name && styles.disabledButton]}
                      onPress={() => {
                        setSelectedModel(model.name);
                        setModalVisible(false);
                      }}
                      disabled={selectedModel === model.name}
                    >
                      <Text style={styles.modalButtonText}>Select</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: "#D9534F" }]}
                      onPress={() => handleRemove(model.name)}
                    >
                      <Text style={styles.modalButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleDownload(model)}
                  >
                    <Text style={styles.modalButtonText}>Baixar</Text>
                  </TouchableOpacity>
                )}
                {selectedModel === model.name && (
                  <Text style={styles.selectedIndicator}>Selected</Text>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#777", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 0,
    paddingTop: "10%",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modelItem: {
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  modelName: {
    fontSize: 16,
    textAlign: "center",
  },
  modelActions: {
    flexDirection: "row",
    marginTop: 5,
    gap: 10,
  },
  selectedIndicator: {
    color: "green",
    marginTop: 5,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 2,
  },
  modelsButton: {
    width: 80,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2A5224",
    borderRadius: 6,
    marginRight: 2,
    marginTop: 35,
    justifyContent: "center"
  },
  modelsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "center"
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#2A5224",
    marginVertical: 4,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

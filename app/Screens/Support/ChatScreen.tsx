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
} from "react-native";
import * as FileSystem from "expo-file-system";
import { generateResponse, availableModels, ChatMessage } from "@/scripts/llm";
import { ensureWhisperLoaded } from "@/scripts/transcription";

interface MessageProps {
  id: string;
  text: string;
  role: "user" | "assistant";
  time: string;
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
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  const flatListRef = useRef<FlatList>(null);

  // Preload Whisper model on mount
  useEffect(() => {
    ensureWhisperLoaded();
  }, []);

  // Check for downloaded models on mount
  useEffect(() => {
    const checkModels = async () => {
      const statuses: { [key: string]: "not_downloaded" | "downloading" | "downloaded" } = {};
      for (const model of availableModels) {
        const path = `${FileSystem.documentDirectory}models/${model.name}`;
        const fileInfo = await FileSystem.getInfoAsync(path);
        statuses[model.name] = fileInfo.exists ? "downloaded" : "not_downloaded";
      }
      setModelStatuses(statuses);

      const downloadedModel = availableModels.find((m) => statuses[m.name] === "downloaded");
      if (downloadedModel) {
        setSelectedModel(downloadedModel.name);
      } else {
        setModalVisible(true);
      }
    };
    checkModels();
  }, []);

  // Handle model download with progress
  const handleDownload = async (model: typeof availableModels[0]) => {
    setModelStatuses((prev) => ({ ...prev, [model.name]: "downloading" }));
    setDownloadProgress((prev) => ({ ...prev, [model.name]: 0 }));
    const path = `${FileSystem.documentDirectory}models/${model.name}`;
    try {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}models`, { intermediates: true });
      const downloadResumable = FileSystem.createDownloadResumable(
        model.url,
        path,
        {},
        (progress) => {
          const percentage = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress((prev) => ({ ...prev, [model.name]: percentage }));
        }
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
          (m) => modelStatuses[m.name] === "downloaded" && m.name !== modelName
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
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const modelPath = `${FileSystem.documentDirectory}models/${selectedModel}`;
      const systemMessage: ChatMessage = { role: "system", content: "You are a helpful assistant." };
      const fullMessages: ChatMessage[] = [
        systemMessage,
        ...messages.map((msg) => ({ role: msg.role, content: msg.text }) as ChatMessage),
        { role: "user", content: text },
      ];
      const response = await generateResponse(fullMessages, modelPath);
      const supportMessage: MessageProps = {
        id: `${Date.now() + 1}`,
        text: response.trim(),
        role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, supportMessage]);
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage: MessageProps = {
        id: `${Date.now() + 1}`,
        text: "Sorry, I couldn't generate a response. Please try again.",
        role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        headerLeft={<BackButton onPress={() => router.back()} />}
        headerRight={
          <View style={{ marginRight: 16 }}>
            <Button title="Models" onPress={() => setModalVisible(true)} />
          </View>
        }
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
        ListFooterComponent={
          isLoading ? (
            <View style={{ padding: 10, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
      />
      <ChatInput onSend={handleSend} disabled={isLoading} />

      {/* Model Selection Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Model</Text>
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
                          { width: `${(downloadProgress[model.name] || 0) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text>{((downloadProgress[model.name] || 0) * 100).toFixed(1)}%</Text>
                  </View>
                ) : modelStatuses[model.name] === "downloaded" ? (
                  <View style={styles.modelActions}>
                    <Button
                      title="Select"
                      onPress={() => {
                        setSelectedModel(model.name);
                        setModalVisible(false);
                      }}
                      disabled={selectedModel === model.name}
                    />
                    <Button title="Remove" onPress={() => handleRemove(model.name)} />
                  </View>
                ) : (
                  <Button title="Download" onPress={() => handleDownload(model)} />
                )}
                {selectedModel === model.name && <Text style={styles.selectedIndicator}>Selected</Text>}
              </View>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
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
    paddingHorizontal: "4%",
    paddingTop: "10%",
  },
  chatContainer: {
    paddingVertical: 8,
    paddingBottom: 60,
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
});

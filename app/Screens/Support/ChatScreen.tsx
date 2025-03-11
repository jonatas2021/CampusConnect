import ChatHeader from "@/components/chat/ChatHeader";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { availableModels } from "@/scripts/models";
import { useModelManager, ModelStatus, DownloadProgress } from "@/components/chat/ModelManager";
import ModelSelectionModal from "@/components/chat/ModelSelectionModal";
import ChatView, { MessageProps } from "@/components/chat/ChatView";

export default function ChatScreen() {
  const router = useRouter();

  // State management
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modelStatuses, setModelStatuses] = useState<ModelStatus>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});

  // Use the model manager hook
  const modelManager = useModelManager(
    // Handle model status changes
    (statuses: ModelStatus, progress: DownloadProgress) => {
    setModelStatuses(statuses);
    setDownloadProgress(progress);
    },
    // Handle selected model changes
    (modelName: string | null) => {
      setSelectedModel(modelName);
      if (!modelName) {
      setModalVisible(true);
      }
    }
  );

  // Handle model error (corrupted model file)
  const handleModelError = () => {
    if (selectedModel) {
      setModelStatuses((prev: ModelStatus) => ({ ...prev, [selectedModel]: "not_downloaded" }));
      setModalVisible(true);
    }
  };

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
      
      <ChatView 
        messages={messages}
        setMessages={setMessages}
        selectedModel={selectedModel}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onModelError={handleModelError}
      />

      {/* Model Selection Modal */}
      <ModelSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modelStatuses={modelStatuses}
        downloadProgress={downloadProgress}
        selectedModel={selectedModel}
        onSelectModel={(modelName: string) => {
          setSelectedModel(modelName);
                        setModalVisible(false);
                      }}
        onDownload={modelManager.handleDownload}
        onPauseDownload={modelManager.handlePauseDownload}
        onResumeDownload={modelManager.handleResumeDownload}
        onRemoveModel={modelManager.handleRemove}
      />
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
});

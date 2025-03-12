import ChatHeader from "@/components/chat/ChatHeader";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { availableModels } from "@/scripts/models";
import { useModelManager, ModelStatus, DownloadProgress } from "@/components/chat/ModelManager";
import ModelSelectionModal from "@/components/chat/ModelSelectionModal";
import ChatView, { MessageProps } from "@/components/chat/ChatView";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

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
      <BackButton onPress={() => router.back()} />
      <Text style={styles.title}>Suporte</Text>
     <View style={styles.separator} />
      
      <ChatHeader
        headerRight={
          <TouchableOpacity style={styles.modelsButton} onPress={() => setModalVisible(true)}>
            <View style={styles.modelsButtonContent}>
              <Text style={styles.modelsButtonText}>Modelos</Text>
              <Ionicons name="cog-outline" size={16} color="#FFFFFF" style={styles.modelsButtonIcon} />
            </View>
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
        onCancelDownload={modelManager.handleCancelDownload}
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
    paddingTop: "6%",
  },
  modelsButton: {
    minWidth: 105,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2A5A06",
    borderRadius: 8,
    marginRight: 2,
    marginTop: 35,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modelsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modelsButtonIcon: {
    marginLeft: 6,
  },
  separator: {
    alignSelf:'center',
    width: "94%",
    height: 2,
    backgroundColor: "#000",
},
title: {
  fontSize: RFValue(20),
  fontWeight: "bold",
  textAlign: "center",
  color: "#000",
  marginBottom: 10,
  marginTop: "10%",
},
});

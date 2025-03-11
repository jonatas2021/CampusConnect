import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { availableModels } from "@/scripts/models";
import { ModelStatus, DownloadProgress } from "./ModelManager";

interface ModelSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  modelStatuses: ModelStatus;
  downloadProgress: DownloadProgress;
  selectedModel: string | null;
  onSelectModel: (modelName: string) => void;
  onDownload: (model: (typeof availableModels)[0]) => Promise<void>;
  onPauseDownload: (modelName: string) => Promise<void>;
  onResumeDownload: (model: (typeof availableModels)[0]) => Promise<void>;
  onRemoveModel: (modelName: string) => Promise<void>;
}

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({
  visible,
  onClose,
  modelStatuses,
  downloadProgress,
  selectedModel,
  onSelectModel,
  onDownload,
  onPauseDownload,
  onResumeDownload,
  onRemoveModel,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: "#F0AD4E" }]}
                      onPress={() => onPauseDownload(model.name)}
                    >
                      <Text style={styles.modalButtonText}>Pausar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: "#D9534F" }]}
                      onPress={() => {
                        Alert.alert(
                          "Cancelar Download",
                          "Tem certeza que deseja cancelar o download? O progresso será perdido.",
                          [
                            { text: "Não", style: "cancel" },
                            { 
                              text: "Sim", 
                              style: "destructive",
                              onPress: () => onRemoveModel(model.name)
                            }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : modelStatuses[model.name] === "paused" ? (
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
                    {((downloadProgress[model.name] || 0) * 100).toFixed(1)}% (Pausado)
                  </Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: "#5CB85C" }]}
                      onPress={() => onResumeDownload(model)}
                    >
                      <Text style={styles.modalButtonText}>Continuar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: "#D9534F" }]}
                      onPress={() => {
                        Alert.alert(
                          "Cancelar Download",
                          "Tem certeza que deseja cancelar o download? O progresso será perdido.",
                          [
                            { text: "Não", style: "cancel" },
                            { 
                              text: "Sim", 
                              style: "destructive",
                              onPress: () => onRemoveModel(model.name)
                            }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : modelStatuses[model.name] === "downloaded" ? (
                <View style={styles.modelActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, selectedModel === model.name && styles.disabledButton]}
                    onPress={() => {
                      onSelectModel(model.name);
                      onClose();
                    }}
                    disabled={selectedModel === model.name}
                  >
                    <Text style={styles.modalButtonText}>Select</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#D9534F" }]}
                    onPress={() => {
                      Alert.alert(
                        "Remove Model",
                        "Are you sure you want to remove this model?",
                        [
                          { text: "No", style: "cancel" },
                          { 
                            text: "Yes", 
                            style: "destructive",
                            onPress: () => onRemoveModel(model.name)
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.modalButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => onDownload(model)}
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
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    marginTop: 10,
  },
  selectedIndicator: {
    color: "green",
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 10,
    width: "100%",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  modalButton: {
    backgroundColor: "#2A5224",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ModelSelectionModal; 
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from "react-native";
import { availableModels } from "@/scripts/models";
import { ModelStatus, DownloadProgress } from "./ModelManager";
import { Ionicons } from "@expo/vector-icons";

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
  onCancelDownload: (modelName: string) => Promise<void>;
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
  onCancelDownload,
  onRemoveModel,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeIconButton} onPress={onClose}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Selecione uma IA</Text>
              {availableModels.map((model, index) => (
                <View key={model.name} style={[
                  styles.modelItem,
                  selectedModel === model.name ? styles.selectedModelItem : null
                ]}>
                  <View style={styles.modelInfo}>
                    <View style={{ flex: 1 }}>
                      <Text 
                        style={[
                          styles.modelName,
                          selectedModel === model.name ? styles.selectedModelText : null
                        ]}
                      >
                        {model.name}
                        {index === 0 }
                      </Text>
                    </View>
                    <Text style={styles.modelSize}>{model.size}</Text>
                  </View>
                  
                  {/* Estado de download em progresso */}
                  {modelStatuses[model.name] === "downloading" && (
                    <View style={styles.downloadProgress}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${(downloadProgress[model.name] || 0) * 100}%` }
                        ]}
                      />
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>
                          {Math.round((downloadProgress[model.name] || 0) * 100)}%
                        </Text>
                      </View>
                      <View style={styles.buttonGroup}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.warningButton]}
                          onPress={() => onPauseDownload(model.name)}
                        >
                          <View style={styles.buttonContent}>
                            <Text style={styles.actionButtonText}>Pausar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.dangerButton]}
                          onPress={() => {
                            Alert.alert(
                              "Cancelar Download",
                              "Tem certeza que deseja cancelar este download?",
                              [
                                { text: "Não", style: "cancel" },
                                { 
                                  text: "Sim", 
                                  style: "destructive",
                                  onPress: () => onCancelDownload(model.name)
                                }
                              ]
                            );
                          }}
                        >
                          <View style={styles.buttonContent}>
                            <Text style={styles.actionButtonText}>Cancelar</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  
                  {/* Estado de download pausado */}
                  {modelStatuses[model.name] === "paused" && (
                    <View style={styles.downloadProgress}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${(downloadProgress[model.name] || 0) * 100}%` },
                          { backgroundColor: "#FFA500" }
                        ]}
                      />
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>
                          Pausado - {Math.round((downloadProgress[model.name] || 0) * 100)}%
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.successButton]}
                        onPress={() => onResumeDownload(model)}
                      >
                        <View style={styles.buttonContent}>
                          <Text style={styles.actionButtonText}>Continuar</Text>
                          <Ionicons name="play" size={16} color="#FFFFFF" style={styles.buttonIconRight} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {/* Modelos baixados - mostrar botões de selecionar e remover */}
                  {modelStatuses[model.name] === "downloaded" ? (
                    <View style={styles.modelActions}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.successButton,
                          selectedModel === model.name ? styles.disabledButton : null
                        ]}
                        onPress={() => {
                          onSelectModel(model.name);
                          onClose();
                        }}
                        disabled={selectedModel === model.name}
                      >
                        <View style={styles.buttonContent}>
                          <Text style={styles.actionButtonText}>
                            {selectedModel === model.name ? "Selecionado" : "Selecionar"}
                          </Text>
                          {selectedModel !== model.name && (
                            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => {
                          Alert.alert(
                            "Remover Modelo",
                            "Tem certeza que deseja remover este modelo?",
                            [
                              { text: "Não", style: "cancel" },
                              { 
                                text: "Sim", 
                                style: "destructive",
                                onPress: () => {
                                  onRemoveModel(model.name);
                                  // Não feche o modal para mostrar a atualização do status
                                }
                              }
                            ]
                          );
                        }}
                      >
                        <View style={styles.buttonContent}>
                          <Text style={styles.actionButtonText}>Remover</Text>
                          <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Modelos não baixados e não em download/pausa - mostrar botão de baixar
                    modelStatuses[model.name] !== "downloading" && 
                    modelStatuses[model.name] !== "paused" && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.successButton]}
                        onPress={() => onDownload(model)}
                      >
                        <View style={styles.buttonContent}>
                          <Text style={[styles.actionButtonText, { flex: 1, textAlign: 'center' }]}>
                            Baixar
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                  
                  {selectedModel === model.name && (
                    <View style={styles.selectedIndicatorContainer}>
                      <Text style={styles.selectedIndicator}>Em uso</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2A5A06",
    textAlign: "center",
  },
  modelItem: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modelInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C3939",
    marginBottom: 4,
    textAlign: "center",
  },
  recommendedTag: {
    color: "#2A5A06",
    fontWeight: "bold",
  },
  modelSize: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  modelActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  selectedIndicator: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  selectedIndicatorContainer: {
    backgroundColor: "#2A5A06",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  downloadProgress: {
    marginTop: 10,
    width: "100%",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#2A5A06",
    borderRadius: 3,
    marginVertical: 8,
  },
  progressTextContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    textAlign: "center",
    color: "#3C3939",
    fontSize: 13,
    fontWeight: '500',
  },
  downloadActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    gap: 8,
  },
  selectedModelItem: {
    backgroundColor: "rgba(146, 195, 107, 0.15)",
    borderColor: "#92C36B",
    borderWidth: 1,
  },
  selectedModelText: {
    fontWeight: "bold",
    color: "#2A5A06",
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: 20,
    width: '60%',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  buttonIconRight: {
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 22,
    paddingHorizontal: 0,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  warningButton: {
    backgroundColor: "#FFA500",
  },
  dangerButton: {
    backgroundColor: "#D9534F",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center"
  },
  successButton: {
    backgroundColor: "#2A5A06",
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#92C36B",
    opacity: 0.8,
  },
  closeIconButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 1,
  },
});

export default ModelSelectionModal; 
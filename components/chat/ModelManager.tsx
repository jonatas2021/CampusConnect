import React, { useState, useEffect, useRef } from "react";
import * as FileSystem from "expo-file-system";
import { Alert, AppState } from "react-native";
import { 
  availableModels, 
  startModelDownload,
  pauseModelDownload,
  cancelModelDownload,
  loadDownloadState,
  DownloadState,
  verifyModelFile,
  activeDownloads,
  removeModel,
  clearDownloadData
} from "@/scripts/models";

export interface ModelStatus {
  [key: string]: "not_downloaded" | "downloading" | "paused" | "downloaded";
}

export interface DownloadProgress {
  [key: string]: number;
}

export interface ModelManagerHandlers {
  modelStatuses: ModelStatus;
  downloadProgress: DownloadProgress;
  handleDownload: (model: (typeof availableModels)[0]) => Promise<void>;
  handlePauseDownload: (modelName: string) => Promise<void>;
  handleResumeDownload: (model: (typeof availableModels)[0]) => Promise<void>;
  handleCancelDownload: (modelName: string) => Promise<void>;
  handleRemove: (modelName: string) => Promise<void>;
  checkModels: () => Promise<void>;
}

export const useModelManager = (
  onModelStatusChange: (statuses: ModelStatus, progress: DownloadProgress) => void,
  onSelectedModelChange: (modelName: string | null) => void
): ModelManagerHandlers => {
  const appState = useRef(AppState.currentState);
  const [modelStatuses, setModelStatuses] = useState<ModelStatus>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'background' && nextAppState === 'active') {
        // App has come to the foreground, refresh download states
        checkModels();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Check for downloaded models on mount
  useEffect(() => {
    checkModels();
  }, []);

  // Update parent component when statuses or progress change
  useEffect(() => {
    onModelStatusChange(modelStatuses, downloadProgress);
  }, [modelStatuses, downloadProgress]);

  // Function to check model status
  const checkModels = async () => {
    console.log("Checking model status...");
    const statuses: ModelStatus = {};
    const progress: DownloadProgress = {};
    
    for (const model of availableModels) {
      const path = `${FileSystem.documentDirectory}models/${model.name}`;
      
      // Primeiro, verifique se o diretório models existe
      const modelsDir = `${FileSystem.documentDirectory}models`;
      const dirInfo = await FileSystem.getInfoAsync(modelsDir);
      if (!dirInfo.exists) {
        try {
          await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true });
          console.log("Created models directory");
        } catch (error) {
          console.error("Failed to create models directory:", error);
        }
      }
      
      // Check if there's an active download
      const downloadState = await loadDownloadState(model.name);
      
      if (downloadState) {
        console.log(`Found download state for ${model.name}:`, downloadState.status, downloadState.progress);
        
        if (downloadState.status === "in_progress" || downloadState.status === "paused") {
          // Primeiro verifique se o arquivo existe fisicamente
          const fileInfo = await FileSystem.getInfoAsync(path, { size: true });
          
          if (fileInfo.exists && fileInfo.size) {
            // O arquivo existe, agora vamos ver se está completo
            if (fileInfo.size >= parseFileSize(model.size) * 0.99) {
              // Se o arquivo está praticamente completo, considere-o como baixado
              try {
                await verifyModelFile(path, model.size);
                statuses[model.name] = "downloaded";
                progress[model.name] = 1;
                console.log(`Model ${model.name} file is complete, marking as downloaded`);
              } catch (error) {
                console.error(`Model ${model.name} validation failed:`, error);
                statuses[model.name] = downloadState.status === "in_progress" ? "downloading" : "paused";
                progress[model.name] = downloadState.progress || 0;
              }
            } else {
              // O arquivo existe mas não está completo
              statuses[model.name] = downloadState.status === "in_progress" ? "downloading" : "paused";
              progress[model.name] = downloadState.progress || (fileInfo.size / parseFileSize(model.size));
            }
          } else {
            // O arquivo não existe, mas temos um estado de download
            // Pode ser um arquivo corrompido ou parcialmente baixado que foi removido
            statuses[model.name] = "not_downloaded";
            progress[model.name] = 0;
            
            // Limpe o estado de download, pois o arquivo não existe mais
            await clearDownloadData(model.name);
          }
          
          // If the download was in progress but the app was closed/backgrounded,
          // we should mark it as paused since it's not actively downloading now
          if (statuses[model.name] === "downloading" && !activeDownloads[model.name]) {
            console.log(`Download for ${model.name} was in progress but is now paused`);
            statuses[model.name] = "paused";
          }
        } else if (downloadState.status === "completed") {
          // The download is marked as completed, verify the file
          try {
            const fileInfo = await FileSystem.getInfoAsync(path, { size: true });
            
            if (fileInfo.exists && fileInfo.size) {
              await verifyModelFile(path, model.size);
              statuses[model.name] = "downloaded";
              progress[model.name] = 1;
            } else {
              // State says completed but file doesn't exist
              console.error(`Model ${model.name} marked as completed but file not found`);
              statuses[model.name] = "not_downloaded";
              progress[model.name] = 0;
              await clearDownloadData(model.name);
            }
          } catch (error) {
            console.error(`Model ${model.name} validation failed:`, error);
            statuses[model.name] = "not_downloaded";
            progress[model.name] = 0;
            
            // Clear invalid state
            await clearDownloadData(model.name);
          }
        } else {
          // For any other status, check if the file exists and is valid
          await checkModelFile(model, path, statuses, progress);
        }
      } else {
        // No download state, check if the file exists and is valid
        await checkModelFile(model, path, statuses, progress);
      }
    }
    
    setModelStatuses(statuses);
    setDownloadProgress(progress);

    // Find a downloaded model to select if none is currently selected
    if (selectedModel === null) {
      const downloadedModel = availableModels.find(
        (m) => statuses[m.name] === "downloaded",
      );
      
      if (downloadedModel) {
        console.log(`Auto-selecting downloaded model ${downloadedModel.name}`);
        setSelectedModel(downloadedModel.name);
        onSelectedModelChange(downloadedModel.name);
      }
    } else {
      // Verify if the currently selected model is still downloaded
      if (statuses[selectedModel] !== "downloaded") {
        console.log(`Currently selected model ${selectedModel} is no longer available`);
        
        // Find another downloaded model to select
        const alternativeModel = availableModels.find(
          (m) => statuses[m.name] === "downloaded",
        );
        
        if (alternativeModel) {
          console.log(`Selecting alternative model ${alternativeModel.name}`);
          setSelectedModel(alternativeModel.name);
          onSelectedModelChange(alternativeModel.name);
        } else {
          console.log("No downloaded models available");
          setSelectedModel(null);
          onSelectedModelChange(null);
        }
      }
    }
  };
  
  // Utility function to parse file size string to bytes
  const parseFileSize = (sizeStr: string): number => {
    let size = 0;
    if (sizeStr.includes("GB")) {
      size = parseFloat(sizeStr.replace(" GB", "")) * 1024 * 1024 * 1024;
    } else if (sizeStr.includes("MB")) {
      size = parseFloat(sizeStr.replace(" MB", "")) * 1024 * 1024;
    } else if (sizeStr.includes("KB")) {
      size = parseFloat(sizeStr.replace(" KB", "")) * 1024;
    } else {
      size = parseFloat(sizeStr);
    }
    return size;
  };

  // Helper function to check if a model file exists and is valid
  const checkModelFile = async (
    model: (typeof availableModels)[0],
    path: string,
    statuses: ModelStatus,
    progress: DownloadProgress
  ) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(path, { size: true });
      
      if (fileInfo.exists && fileInfo.size) {
        // Verify the file is valid
        try {
          await verifyModelFile(path, model.size);
          statuses[model.name] = "downloaded";
          progress[model.name] = 1;
        } catch (error) {
          console.error(`Model ${model.name} validation failed:`, error);
          statuses[model.name] = "not_downloaded";
          progress[model.name] = 0;
          
          // Delete the invalid file
          try {
            await FileSystem.deleteAsync(path, { idempotent: true });
          } catch (deleteError) {
            console.error(`Failed to delete invalid model ${model.name}:`, deleteError);
          }
        }
      } else {
        statuses[model.name] = "not_downloaded";
        progress[model.name] = 0;
      }
    } catch (error) {
      console.error(`Error checking model ${model.name}:`, error);
      statuses[model.name] = "not_downloaded";
      progress[model.name] = 0;
    }
  };

  // Handle model download with progress
  const handleDownload = async (model: (typeof availableModels)[0]) => {
    const path = `${FileSystem.documentDirectory}models/${model.name}`;
    
    // Update UI state to downloading
    setModelStatuses((prev) => ({ ...prev, [model.name]: "downloading" }));
    setDownloadProgress((prev) => ({ ...prev, [model.name]: 0 }));
    
    try {
      // Start the download with progress callback
      await startModelDownload(
        model,
        path,
        (state: DownloadState) => {
          // Update UI with download progress
          if (state.status === "in_progress") {
            setDownloadProgress((prev) => ({
              ...prev,
              [model.name]: state.progress,
            }));
          } else if (state.status === "completed") {
            setModelStatuses((prev) => ({ ...prev, [model.name]: "downloaded" }));
            setSelectedModel(model.name);
            onSelectedModelChange(model.name);
          } else if (state.status === "failed") {
            setModelStatuses((prev) => ({ ...prev, [model.name]: "not_downloaded" }));
            Alert.alert(
              "Download Failed",
              `Failed to download model: ${state.error || "Unknown error"}. Please try again.`,
              [{ text: "OK" }]
            );
          }
        }
      );
    } catch (error) {
      setModelStatuses((prev) => ({ ...prev, [model.name]: "not_downloaded" }));
      console.error("Download failed:", error);
      
      Alert.alert(
        "Download Failed",
        `Failed to download model: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        [{ text: "OK" }]
      );
    }
  };

  // Handle pausing a download
  const handlePauseDownload = async (modelName: string) => {
    try {
      await pauseModelDownload(modelName);
      setModelStatuses((prev) => ({ ...prev, [modelName]: "paused" }));
    } catch (error) {
      console.error("Failed to pause download:", error);
    }
  };

  // Handle resuming a download
  const handleResumeDownload = async (model: (typeof availableModels)[0]) => {
    // Update UI state to downloading
    setModelStatuses((prev) => ({ ...prev, [model.name]: "downloading" }));
    
    // Don't reset the progress in the UI when resuming
    // We'll keep the existing progress until we get an update from the download
    const currentProgress = downloadProgress[model.name] || 0;
    
    try {
      // Start the download but don't reset the UI state
      await startModelDownload(
        model,
        `${FileSystem.documentDirectory}models/${model.name}`,
        (state: DownloadState) => {
          // Only update the UI if the new progress is greater than what we're showing
          // This prevents the progress from jumping back to 0%
          if (state.status === "in_progress") {
            setModelStatuses((prev) => ({ ...prev, [model.name]: "downloading" }));
            
            // Only update progress if it's greater than what we're showing
            if (state.progress > currentProgress) {
              setDownloadProgress((prev) => ({
                ...prev,
                [model.name]: state.progress,
              }));
            }
          } else if (state.status === "completed") {
            setModelStatuses((prev) => ({ ...prev, [model.name]: "downloaded" }));
            setDownloadProgress((prev) => ({
              ...prev,
              [model.name]: 1,
            }));
            setSelectedModel(model.name);
            onSelectedModelChange(model.name);
          } else if (state.status === "failed") {
            setModelStatuses((prev) => ({ ...prev, [model.name]: "not_downloaded" }));
            Alert.alert(
              "Download Failed",
              `Failed to download model: ${state.error || "Unknown error"}. Please try again.`,
              [{ text: "OK" }]
            );
          }
        }
      );
    } catch (error) {
      console.error("Resume download failed:", error);
      setModelStatuses((prev) => ({ ...prev, [model.name]: "not_downloaded" }));
      Alert.alert(
        "Resume Failed",
        `Failed to resume download: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        [{ text: "OK" }]
      );
    }
  };

  // Handle canceling a download
  const handleCancelDownload = async (modelName: string) => {
    const path = `${FileSystem.documentDirectory}models/${modelName}`;
    try {
      await cancelModelDownload(modelName, path);
      setModelStatuses((prev) => ({ ...prev, [modelName]: "not_downloaded" }));
      setDownloadProgress((prev) => ({ ...prev, [modelName]: 0 }));
    } catch (error) {
      console.log("Failed to cancel download:", error);
    }
  };

  // Handle model removal
  const handleRemove = async (modelName: string) => {
    const path = `${FileSystem.documentDirectory}models/${modelName}`;
    try {
      console.log(`Starting removal of model ${modelName}`);
      
      // Update UI state immediately to show model as not downloaded
      setModelStatuses((prev) => ({ ...prev, [modelName]: "not_downloaded" }));
      setDownloadProgress((prev) => ({ ...prev, [modelName]: 0 }));
      
      // Use the new removeModel function that does more robust checking
      await removeModel(modelName, path);
      
      console.log(`After removal, checking if model is actually removed`);
      
      // Verify file was actually removed
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        console.error(`Model file still exists after removal attempt!`);
        
        // Force delete again with a slight delay
        setTimeout(async () => {
          try {
            await FileSystem.deleteAsync(path, { idempotent: true });
            console.log(`Second deletion attempt completed`);
          } catch (secondError) {
            console.error(`Second deletion attempt failed:`, secondError);
          }
        }, 500);
      } else {
        console.log(`Model ${modelName} successfully removed`);
      }
      
      // If the removed model was selected, find another downloaded model or set to null
      if (selectedModel === modelName) {
        const remainingModel = availableModels.find(
          (m) => m.name !== modelName && modelStatuses[m.name] === "downloaded",
        );
        
        if (remainingModel) {
          setSelectedModel(remainingModel.name);
          onSelectedModelChange(remainingModel.name);
        } else {
          setSelectedModel(null);
          onSelectedModelChange(null);
        }
      }
      
      // Force a check of models to ensure UI is in sync with filesystem
      await checkModels();
      
    } catch (error) {
      console.error("Remove failed:", error);
      Alert.alert(
        "Erro na Remoção",
        "Não foi possível remover o modelo. Por favor, tente novamente.",
        [{ text: "OK" }]
      );
      
      // Force check models to ensure UI is in sync
      await checkModels();
    }
  };

  return {
    modelStatuses,
    downloadProgress,
    handleDownload,
    handlePauseDownload,
    handleResumeDownload,
    handleCancelDownload,
    handleRemove,
    checkModels
  };
};

export default useModelManager; 
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
  activeDownloads
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
      
      // First check if there's an active download
      const downloadState = await loadDownloadState(model.name);
      
      if (downloadState) {
        console.log(`Found download state for ${model.name}:`, downloadState.status, downloadState.progress);
        
        if (downloadState.status === "in_progress" || downloadState.status === "paused") {
          // There's an active or paused download
          statuses[model.name] = downloadState.status === "in_progress" ? "downloading" : "paused";
          progress[model.name] = downloadState.progress;
          
          // If the download was in progress but the app was closed/backgrounded,
          // we should mark it as paused since it's not actively downloading now
          if (downloadState.status === "in_progress" && !activeDownloads[model.name]) {
            console.log(`Download for ${model.name} was in progress but is now paused`);
            statuses[model.name] = "paused";
          }
        } else if (downloadState.status === "completed") {
          // The download is marked as completed, verify the file
          try {
            await verifyModelFile(path, model.size);
            statuses[model.name] = "downloaded";
          } catch (error) {
            console.error(`Model ${model.name} validation failed:`, error);
            statuses[model.name] = "not_downloaded";
            progress[model.name] = 0;
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

    const downloadedModel = availableModels.find(
      (m) => statuses[m.name] === "downloaded",
    );
    if (downloadedModel) {
      onSelectedModelChange(downloadedModel.name);
    } else {
      onSelectedModelChange(null);
    }
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

  // Handle model removal
  const handleRemove = async (modelName: string) => {
    const path = `${FileSystem.documentDirectory}models/${modelName}`;
    try {
      // Cancel any active download first
      await cancelModelDownload(modelName, path);
      
      // Delete the file if it exists
      await FileSystem.deleteAsync(path, { idempotent: true });
      
      setModelStatuses((prev) => ({ ...prev, [modelName]: "not_downloaded" }));
      
      // If the removed model was selected, find another downloaded model or set to null
      const remainingModel = availableModels.find(
        (m) => modelStatuses[m.name] === "downloaded" && m.name !== modelName,
      );
      
      if (remainingModel) {
        onSelectedModelChange(remainingModel.name);
      } else {
        onSelectedModelChange(null);
      }
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  return {
    modelStatuses,
    downloadProgress,
    handleDownload,
    handlePauseDownload,
    handleResumeDownload,
    handleRemove,
    checkModels
  };
};

export default useModelManager; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { DownloadState } from './types';

// Storage keys for download state
const DOWNLOAD_STATE_KEY_PREFIX = "model_download_state_";
const DOWNLOAD_RESUMABLE_KEY_PREFIX = "model_download_resumable_";
const MODEL_STATUS_KEY = "model_status_";

// Save download state to persistent storage
export async function saveDownloadState(modelName: string, state: DownloadState): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${DOWNLOAD_STATE_KEY_PREFIX}${modelName}`,
      JSON.stringify(state)
    );
  } catch (error) {
    console.error("Failed to save download state:", error);
  }
}

// Load download state from persistent storage
export async function loadDownloadState(modelName: string): Promise<DownloadState | null> {
  try {
    const stateJson = await AsyncStorage.getItem(`${DOWNLOAD_STATE_KEY_PREFIX}${modelName}`);
    if (stateJson) {
      return JSON.parse(stateJson) as DownloadState;
    }
  } catch (error) {
    console.error("Failed to load download state:", error);
  }
  return null;
}

// Save download resumable object to persistent storage
export async function saveDownloadResumable(modelName: string, resumable: FileSystem.DownloadResumable): Promise<void> {
  try {
    const serialized = await resumable.savable();
    await AsyncStorage.setItem(
      `${DOWNLOAD_RESUMABLE_KEY_PREFIX}${modelName}`,
      JSON.stringify(serialized)
    );
  } catch (error) {
    console.error("Failed to save download resumable:", error);
  }
}

// Load download resumable object from persistent storage
export async function loadDownloadResumable(modelName: string): Promise<FileSystem.DownloadResumable | null> {
  try {
    const serializedJson = await AsyncStorage.getItem(`${DOWNLOAD_RESUMABLE_KEY_PREFIX}${modelName}`);
    if (serializedJson) {
      const pauseState = JSON.parse(serializedJson);
      return await FileSystem.createDownloadResumable(
        pauseState.url,
        pauseState.fileUri,
        pauseState.options || {},
        undefined, // We'll set the callback when we resume
        pauseState.resumeData
      );
    }
  } catch (error) {
    console.error("Failed to load download resumable:", error);
  }
  return null;
}

// Clear download state and resumable data
export async function clearDownloadData(modelName: string): Promise<void> {
  try {
    console.log(`Clearing all storage data for model ${modelName}`);
    
    // Remove specific model keys
    await AsyncStorage.removeItem(`${DOWNLOAD_STATE_KEY_PREFIX}${modelName}`);
    await AsyncStorage.removeItem(`${DOWNLOAD_RESUMABLE_KEY_PREFIX}${modelName}`);
    await AsyncStorage.removeItem(`${MODEL_STATUS_KEY}${modelName}`);
    
    // Also remove any other keys that might be related to this model
    const allKeys = await AsyncStorage.getAllKeys();
    const relatedKeys = allKeys.filter(
      key => key.includes(modelName) || 
             key.includes(encodeURIComponent(modelName))
    );
    
    if (relatedKeys.length > 0) {
      console.log(`Found ${relatedKeys.length} additional keys to remove for ${modelName}`);
      await AsyncStorage.multiRemove(relatedKeys);
    }
    
    console.log(`Storage data cleared for model ${modelName}`);
  } catch (error) {
    console.error("Failed to clear download data:", error);
  }
}

// Get all models status from AsyncStorage
export async function getAllModelStatuses(): Promise<{[key: string]: string}> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const statusKeys = allKeys.filter(key => key.startsWith(MODEL_STATUS_KEY));
    
    if (statusKeys.length === 0) {
      return {};
    }
    
    const entries = await AsyncStorage.multiGet(statusKeys);
    const result: {[key: string]: string} = {};
    
    entries.forEach(([key, value]) => {
      if (value) {
        const modelName = key.replace(MODEL_STATUS_KEY, "");
        result[modelName] = value;
      }
    });
    
    return result;
  } catch (error) {
    console.error("Failed to get model statuses:", error);
    return {};
  }
}

// Save model status
export async function saveModelStatus(modelName: string, status: string): Promise<void> {
  try {
    await AsyncStorage.setItem(`${MODEL_STATUS_KEY}${modelName}`, status);
  } catch (error) {
    console.error("Failed to save model status:", error);
  }
} 
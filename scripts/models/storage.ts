import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { DownloadState } from './types';

// Storage keys for download state
const DOWNLOAD_STATE_KEY_PREFIX = "model_download_state_";
const DOWNLOAD_RESUMABLE_KEY_PREFIX = "model_download_resumable_";

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
    await AsyncStorage.removeItem(`${DOWNLOAD_STATE_KEY_PREFIX}${modelName}`);
    await AsyncStorage.removeItem(`${DOWNLOAD_RESUMABLE_KEY_PREFIX}${modelName}`);
  } catch (error) {
    console.error("Failed to clear download data:", error);
  }
} 
import * as FileSystem from "expo-file-system";
import { Model, DownloadState } from './types';
import { availableModels } from './models';
import { 
  saveDownloadState, 
  loadDownloadState, 
  saveDownloadResumable, 
  loadDownloadResumable, 
  clearDownloadData 
} from './storage';
import { verifyModelFile } from './utils';

// Cache for active downloads
export const activeDownloads: { [key: string]: FileSystem.DownloadResumable } = {};

// Start or resume a model download
export async function startModelDownload(
  model: Model,
  path: string,
  progressCallback: (state: DownloadState) => void
): Promise<void> {
  const modelName = model.name;
  
  // Create directory if it doesn't exist
  await FileSystem.makeDirectoryAsync(
    path.substring(0, path.lastIndexOf('/')),
    { intermediates: true }
  );
  
  // First, try to load the existing download state
  const existingState = await loadDownloadState(modelName);
  
  // Check if we have an existing download to resume
  let downloadResumable = activeDownloads[modelName];
  
  if (!downloadResumable) {
    // Try to load a saved resumable download
    const loadedResumable = await loadDownloadResumable(modelName);
    
    // If no saved download, create a new one
    if (loadedResumable) {
      console.log(`Resuming download for ${modelName} from saved state`);
      
      // We need to recreate the download resumable with the progress callback
      downloadResumable = loadedResumable;
      
      // Set the callback for progress updates
      downloadResumable = FileSystem.createDownloadResumable(
        model.url,
        path,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          const state: DownloadState = {
            modelName,
            progress,
            status: "in_progress",
            bytesWritten: downloadProgress.totalBytesWritten,
            bytesExpected: downloadProgress.totalBytesExpectedToWrite,
            timestamp: Date.now()
          };
          
          // Save state and resumable on each progress update
          saveDownloadState(modelName, state);
          saveDownloadResumable(modelName, downloadResumable);
          
          // Call the progress callback
          progressCallback(state);
        }
      );
    } else {
      console.log(`Starting new download for ${modelName}`);
      downloadResumable = FileSystem.createDownloadResumable(
        model.url,
        path,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          const state: DownloadState = {
            modelName,
            progress,
            status: "in_progress",
            bytesWritten: downloadProgress.totalBytesWritten,
            bytesExpected: downloadProgress.totalBytesExpectedToWrite,
            timestamp: Date.now()
          };
          
          // Save state and resumable on each progress update
          saveDownloadState(modelName, state);
          saveDownloadResumable(modelName, downloadResumable);
          
          // Call the progress callback
          progressCallback(state);
        }
      );
    }
    
    // Store the download in our active downloads cache
    activeDownloads[modelName] = downloadResumable;
  }
  
  try {
    // If we have an existing state, use it for the initial callback
    // This prevents the progress from resetting to 0% in the UI
    if (existingState && existingState.progress > 0) {
      // Update status to in_progress but keep the progress value
      const initialState: DownloadState = {
        ...existingState,
        status: "in_progress",
        timestamp: Date.now()
      };
      await saveDownloadState(modelName, initialState);
      progressCallback(initialState);
    } else {
      // No existing state, start from 0%
      const initialState: DownloadState = {
        modelName,
        progress: 0,
        status: "in_progress",
        bytesWritten: 0,
        bytesExpected: 0,
        timestamp: Date.now()
      };
      await saveDownloadState(modelName, initialState);
      progressCallback(initialState);
    }
    
    // Start or resume the download
    console.log(`Executing download for ${modelName}`);
    let result;
    
    // Check if we're resuming a paused download
    if (existingState && existingState.status === "paused") {
      console.log(`Resuming paused download for ${modelName}`);
      result = await downloadResumable.resumeAsync();
    } else {
      // Start a new download
      result = await downloadResumable.downloadAsync();
    }
    
    if (result && result.status === 200) {
      // Download completed successfully
      const finalState: DownloadState = {
        modelName,
        progress: 1,
        status: "completed",
        bytesWritten: 0, // We don't have this info from the result
        bytesExpected: 0, // We don't have this info from the result
        timestamp: Date.now()
      };
      await saveDownloadState(modelName, finalState);
      progressCallback(finalState);
      
      // Verify the downloaded file
      await verifyModelFile(path, model.size);
      
      // Clean up after successful download
      delete activeDownloads[modelName];
      await clearDownloadData(modelName);
    } else {
      throw new Error(`Download failed with status: ${result?.status || 'unknown'}`);
    }
  } catch (error) {
    // Handle download error
    const errorState: DownloadState = {
      modelName,
      progress: existingState?.progress || 0, // Preserve progress on error
      status: "failed",
      bytesWritten: existingState?.bytesWritten || 0,
      bytesExpected: existingState?.bytesExpected || 0,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now()
    };
    await saveDownloadState(modelName, errorState);
    progressCallback(errorState);
    
    // Clean up failed download
    delete activeDownloads[modelName];
    console.error("Download error:", error);
    throw error;
  }
}

// Pause an active download
export async function pauseModelDownload(modelName: string): Promise<void> {
  const downloadResumable = activeDownloads[modelName];
  if (downloadResumable) {
    try {
      console.log(`Pausing download for ${modelName}`);
      
      // Get the current download state before pausing
      const currentState = await loadDownloadState(modelName);
      
      // Call pauseAsync on the downloadResumable object
      const pauseState = await downloadResumable.pauseAsync();
      
      // Save the resumable state after pausing
      await saveDownloadResumable(modelName, downloadResumable);
      
      // Update the download state to paused, but preserve progress
      if (currentState) {
        const pausedState: DownloadState = {
          ...currentState,
          status: "paused",
          timestamp: Date.now()
        };
        await saveDownloadState(modelName, pausedState);
      } else {
        // If we don't have a current state for some reason, create a minimal one
        const pausedState: DownloadState = {
          modelName,
          progress: 0,
          status: "paused",
          bytesWritten: 0,
          bytesExpected: 0,
          timestamp: Date.now()
        };
        await saveDownloadState(modelName, pausedState);
      }
      
      // Remove from active downloads
      delete activeDownloads[modelName];
    } catch (error) {
      console.error(`Failed to pause download for ${modelName}:`, error);
      throw error;
    }
  } else {
    console.warn(`No active download found for ${modelName} to pause`);
  }
}

// Cancel an active download
export async function cancelModelDownload(modelName: string, path: string): Promise<void> {
  // Cancel the active download if it exists
  const downloadResumable = activeDownloads[modelName];
  if (downloadResumable) {
    try {
      console.log(`Cancelling download for ${modelName}`);
      await downloadResumable.cancelAsync();
    } catch (error) {
      console.error(`Failed to cancel download for ${modelName}:`, error);
    }
  }
  
  // Remove from active downloads
  delete activeDownloads[modelName];
  
  // Clear saved state
  await clearDownloadData(modelName);
  
  // Delete partial file if it exists
  try {
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
  } catch (error) {
    console.error("Failed to delete partial download:", error);
  }
}

// Wrapper function for downloading a model
export async function downloadModel(
  model: Model,
  path: string,
  progressCallback: (state: DownloadState) => void
): Promise<void> {
  await startModelDownload(model, path, progressCallback);
}

// Wrapper function for validating a model
export async function validateModel(
  model: Model,
  path: string
): Promise<boolean> {
  return await verifyModelFile(path, model.size);
} 
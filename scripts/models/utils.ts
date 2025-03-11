import * as FileSystem from "expo-file-system";

// Verify the downloaded model file
export async function verifyModelFile(path: string, expectedSize: string): Promise<boolean> {
  // Get file info
  const fileInfo = await FileSystem.getInfoAsync(path, { size: true });
  if (!fileInfo.exists || !fileInfo.size) {
    throw new Error("Downloaded file doesn't exist or has zero size");
  }
  
  // Calculate expected size in bytes
  let expectedBytes = 0;
  if (expectedSize.includes("GB")) {
    expectedBytes = parseFloat(expectedSize.replace(" GB", "")) * 1024 * 1024 * 1024;
  } else if (expectedSize.includes("MB")) {
    expectedBytes = parseFloat(expectedSize.replace(" MB", "")) * 1024 * 1024;
  }
  
  // Check if file size is reasonable (at least 90% of expected size)
  if (expectedBytes > 0 && fileInfo.size < expectedBytes * 0.9) {
    throw new Error(`Downloaded file is incomplete. Expected ~${expectedBytes} bytes, got ${fileInfo.size} bytes`);
  }
  
  // Try to validate the model file by attempting to read it
  try {
    await FileSystem.readAsStringAsync(path, { 
      encoding: FileSystem.EncodingType.Base64,
      position: 0,
      length: 1024 // Just read the first 1KB to check if file is readable
    });
    return true;
  } catch (error) {
    console.error("Model validation failed:", error);
    throw new Error("Downloaded model file is invalid or corrupted");
  }
} 
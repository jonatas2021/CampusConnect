// Define model interface
export interface Model {
  name: string;
  size: string;
  url: string;
}

// Download state interface
export interface DownloadState {
  modelName: string;
  progress: number;
  status: "not_started" | "in_progress" | "paused" | "completed" | "failed";
  bytesWritten: number;
  bytesExpected: number;
  error?: string;
  timestamp: number;
}

// Interfaces for chat messages and generation options
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateOptions {
  temperature?: number;
  top_p?: number;
  n_predict?: number;
  stop?: string[];
}

// Custom error class for inference errors
export class InferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InferenceError";
  }
} 
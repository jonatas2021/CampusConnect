import { initLlama } from "llama.rn";
import * as FileSystem from "expo-file-system";

// Define available models with metadata
export const availableModels = [
  {
    name: "Text2Graph-R1-Qwen2.5-0.5b.Q4_K_S.gguf",
    size: "385MB",
    url: "https://huggingface.co/mradermacher/Text2Graph-R1-Qwen2.5-0.5b-GGUF/resolve/main/Text2Graph-R1-Qwen2.5-0.5b.Q4_K_S.gguf",
  },
  {
    name: "Qwen2.5-0.5B-Instruct-Q8_0.gguf",
    size: "531MB",
    url: "https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q8_0.gguf",
  },
];

// Special tokens for Qwen model architecture
const SPECIAL_TOKENS = {
  IM_START: "<|im_start|>",
  IM_END: "<|im_end|>",
};

// Cache for loaded model contexts by model path
const modelContexts: { [key: string]: any } = {};

// Ensure the model is loaded, reusing it if already initialized
async function ensureModelLoaded(modelPath: string): Promise<any> {
  if (!modelContexts[modelPath]) {
    const fileInfo = await FileSystem.getInfoAsync(modelPath);
    if (!fileInfo.exists) {
      throw new Error(`Model file not found at ${modelPath}. Please ensure the model is downloaded.`);
    }
    modelContexts[modelPath] = await initLlama({
      model: modelPath,
      use_mlock: true,
      n_ctx: 4096,
      n_gpu_layers: 0,
    });
  }
  return modelContexts[modelPath];
}

// Download a model
export async function downloadModel(modelUrl: string, path: string): Promise<void> {
  const downloadResumable = FileSystem.createDownloadResumable(
    modelUrl,
    path,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      console.log(`Download progress: ${(progress * 100).toFixed(2)}%`);
    }
  );

  try {
    const result = await downloadResumable.downloadAsync();
    if (!result || result.status !== 200) {
      throw new Error("Failed to download model");
    }
    console.log("Download complete:", path);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

// Interfaces for chat messages and generation options
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateOptions {
  temperature?: number;
  top_p?: number;
  n_predict?: number;
  stop?: string[];
}

// Custom error class for inference errors
class InferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InferenceError";
  }
}

// Generate a response using the specified model
export const generateResponse = async (
  messages: ChatMessage[],
  modelPath: string,
  options: GenerateOptions = {}
): Promise<string> => {
  const { temperature = 0.7, top_p = 0.95, n_predict = 1000, stop = [SPECIAL_TOKENS.IM_END] } = options;

  try {
    const model = await ensureModelLoaded(modelPath);
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: `${SPECIAL_TOKENS.IM_START}${msg.role}\n${msg.content}${SPECIAL_TOKENS.IM_END}`,
    }));
    formattedMessages.push({ role: "assistant", content: `${SPECIAL_TOKENS.IM_START}assistant\n` });

    const result = await model.completion({
      messages: formattedMessages,
      temperature,
      top_p,
      n_predict,
      stop,
    });

    const rawResponse = result.text;
    return rawResponse
      .replace(`${SPECIAL_TOKENS.IM_START}assistant\n`, "")
      .replace(SPECIAL_TOKENS.IM_END, "")
      .trim();
  } catch (error) {
    console.error("Generation error:", error);
    throw new InferenceError("Response generation failed");
  }
};

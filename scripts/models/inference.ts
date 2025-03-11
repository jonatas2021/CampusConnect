import { initLlama } from "llama.rn";
import * as FileSystem from "expo-file-system";
import { ChatMessage, GenerateOptions, InferenceError } from './types';
import { SPECIAL_TOKENS } from './models';

// Cache for loaded model contexts by model path
const modelContexts: { [key: string]: any } = {};

// Ensure the model is loaded, reusing it if already initialized
async function ensureModelLoaded(modelPath: string): Promise<any> {
  if (!modelContexts[modelPath]) {
    const fileInfo = await FileSystem.getInfoAsync(modelPath, { size: true });
    if (!fileInfo.exists) {
      throw new Error(`Model file not found at ${modelPath}. Please ensure the model is downloaded.`);
    }
    
    // Check if file has a reasonable size (at least 100MB for any model)
    if (!fileInfo.size || fileInfo.size < 100 * 1024 * 1024) {
      throw new Error(`Model file at ${modelPath} appears to be incomplete or corrupted. Please re-download the model.`);
    }
    
    try {
      modelContexts[modelPath] = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 4096,
        n_gpu_layers: 0,
      });
    } catch (error) {
      // If model loading fails, clear the context and rethrow
      delete modelContexts[modelPath];
      console.error(`Failed to load model at ${modelPath}:`, error);
      throw new Error(`Failed to initialize model. The model file may be corrupted. Please re-download the model.`);
    }
  }
  return modelContexts[modelPath];
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

// Generate a response using the specified model with streaming
export async function* generateResponseStream(
  messages: ChatMessage[],
  modelPath: string,
  options: GenerateOptions = {}
): AsyncGenerator<string, void, unknown> {
  const { temperature = 0.7, top_p = 0.95, n_predict = 1000, stop = [SPECIAL_TOKENS.IM_END] } = options;

  try {
    const model = await ensureModelLoaded(modelPath);
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: `${SPECIAL_TOKENS.IM_START}${msg.role}\n${msg.content}${SPECIAL_TOKENS.IM_END}`,
    }));
    formattedMessages.push({ role: "assistant", content: `${SPECIAL_TOKENS.IM_START}assistant\n` });

    // Create a generator for streaming responses
    const stream = await model.completion({
      messages: formattedMessages,
      temperature,
      top_p,
      n_predict,
      stop,
      stream: true,
    });

    let buffer = "";
    for await (const chunk of stream) {
      buffer += chunk.text;
      
      // Yield complete words or punctuation
      if (buffer.match(/[\s.,!?;:]/)) {
        const parts = buffer.split(/(?<=[\s.,!?;:])/);
        if (parts.length > 1) {
          const completeText = parts.slice(0, -1).join("");
          yield completeText
            .replace(`${SPECIAL_TOKENS.IM_START}assistant\n`, "")
            .replace(SPECIAL_TOKENS.IM_END, "");
          buffer = parts[parts.length - 1];
        }
      }
    }

    // Yield any remaining text
    if (buffer) {
      yield buffer
        .replace(`${SPECIAL_TOKENS.IM_START}assistant\n`, "")
        .replace(SPECIAL_TOKENS.IM_END, "");
    }
  } catch (error) {
    console.error("Streaming generation error:", error);
    throw new InferenceError("Response generation failed");
  }
}

// Wrapper function to handle streaming responses
export async function* generateResponseStreamWrapper(
  messages: ChatMessage[],
  modelPath: string
): AsyncGenerator<string, void, unknown> {
  try {
    // Verify model file exists and is valid before attempting to use it
    const fileInfo = await FileSystem.getInfoAsync(modelPath, { size: true });
    if (!fileInfo.exists || !fileInfo.size) {
      throw new Error("Model file not found or is empty. Please re-download the model.");
    }
    
    // Use the streaming generator
    for await (const chunk of generateResponseStream(messages, modelPath)) {
      yield chunk;
    }
  } catch (error) {
    console.error("Error in stream wrapper:", error);
    throw error;
  }
} 
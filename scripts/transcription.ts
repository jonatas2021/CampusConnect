import * as FileSystem from "expo-file-system";

const WHISPER_MODEL = "whisper-tiny.llamafile";
const WHISPER_URL = "https://huggingface.co/Mozilla/whisperfile/resolve/main/whisper-tiny.llamafile";
const whisperPath = `${FileSystem.documentDirectory}models/${WHISPER_MODEL}`;

let whisperContext: any = null;

export async function ensureWhisperLoaded() {
  if (!whisperContext) {
    const fileInfo = await FileSystem.getInfoAsync(whisperPath);
    if (!fileInfo.exists) {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}models`, { intermediates: true });
      await FileSystem.downloadAsync(WHISPER_URL, whisperPath);
    }
    whisperContext = { ready: true }; // Simulated context
    console.log("Whisper model loaded at:", whisperPath);
  }
  return whisperContext;
}

export async function transcribeAudio(audioUri: string): Promise<string> {
  try {
    const whisper = await ensureWhisperLoaded();
    if (!whisper.ready) throw new Error("Whisper not initialized");

    console.log("Transcribing audio from:", audioUri);
    return "Transcribed text placeholder";
  } catch (error) {
    console.error("Transcription error:", error);
    return "Error transcribing audio.";
  }
}
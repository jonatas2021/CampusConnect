import React, { useState, useRef, useCallback } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { transcribeAudio } from "@/scripts/transcription";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingLocked, setRecordingLocked] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleSend = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSend(trimmedText);
      setText("");
      textInputRef.current?.focus();
    }
  }, [text, onSend]);

  const onGestureEvent = (event: any) => {
    if (isRecording && !recordingLocked) {
      const { translationX, translationY } = event.nativeEvent;
      if (translationX < -50) {
        cancelRecording();
      } else if (translationY < -50) {
        lockRecording();
      }
    }
  };

  const onHandlerStateChange = async (event: any) => {
    if (text.trim()) return;
    if (event.nativeEvent.state === State.BEGAN) {
      await startRecording();
    } else if (event.nativeEvent.state === State.END && !recordingLocked) {
      await stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY // Fixed preset
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      setRecordingLocked(false);
      if (uri) {
        const transcribedText = await transcribeAudio(uri);
        setText(transcribedText);
      }
    }
  };

  const cancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsRecording(false);
      setRecordingLocked(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const lockRecording = () => {
    setRecordingLocked(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (text.trim()) {
      handleSend();
    }
  };

  const iconName = text.trim()
    ? "send"
    : isRecording
    ? recordingLocked
      ? "stop"
      : "record"
    : "microphone";

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escreva um comentário"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!disabled && !isRecording}
          />
        </View>
        {recordingLocked ? (
          <View style={styles.recordingControls}>
            <TouchableOpacity onPress={cancelRecording}>
              <MaterialCommunityIcons name="close" color="#fff" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={stopRecording}>
              <MaterialCommunityIcons name="send" color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        ) : (
          <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePress} // Fixed onPress
              activeOpacity={0.7}
              disabled={disabled}
            >
              <MaterialCommunityIcons name={iconName} color="#fff" size={24} />
            </TouchableOpacity>
          </PanGestureHandler>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#2A5224",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 42,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  button: {
    backgroundColor: "#66bb6a",
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowRadius: 5,
    elevation: 6,
    overflow: "hidden",
    marginLeft: 10,
  },
  recordingControls: {
    flexDirection: "row",
    gap: 20,
    marginLeft: 10,
  },
});
